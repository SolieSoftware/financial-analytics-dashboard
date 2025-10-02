import hashlib
from typing import Callable, Any
from functools import wraps
import logging

# Redis Client
from services.redis_client import RedisClient

# Serializers
from utils.serializers import CacheSerializer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CacheManager:
    def __init__(self, redis_client: RedisClient, serializer: CacheSerializer):
        self.redis_client = redis_client
        self.serializer = serializer

    def generate_cache_key(self, prefix: str, *args, **kwargs) -> str:
        args_str = str(args) + str(sorted(kwargs.items()))
        args_hash = hashlib.md5(args_str.encode()).hexdigest()
        return f"{prefix}:{args_hash}"


    def cache_result(self, ttl: int, key_prefix: str, *args, **kwargs):
        """Decorator to cache async function results in Redis"""

        def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
            @wraps(func)
            async def wrapper(*args, **kwargs):
                if not self.redis_client:
                    raise ValueError("Redis client not initialized")

                cache_key = self.generate_cache_key(key_prefix, *args, **kwargs)

                if self.redis_client.redis:
                    try:
                        logger.info(f"Getting cached data for {cache_key}")
                        cached_data = await self.redis_client.redis.get(cache_key)
                        if cached_data:
                            result = await self.serializer.deserialize_data(cached_data)
                            if result is not None:
                                return result
                            else:
                                # If deserialization failed, delete the corrupted cache entry
                                logger.warning(
                                    f"Deleting corrupted cache entry: {cache_key}"
                                )
                                await self.redis_client.redis.delete(cache_key)

                    except Exception as e:
                        logger.error(f"Error getting cached data: {str(e)}")

                result = await func(*args, **kwargs)

                if self.redis_client and self.redis_client.redis and result is not None:
                    try:
                        serialized_data = await self.serializer.serialize_data(result)
                        await self.redis_client.redis.setex(cache_key, ttl, serialized_data)
                        logger.info(f"Cached result for {cache_key}")
                    except Exception as e:
                        logger.error(f"Error caching result: {str(e)}")
                return result

            return wrapper

        return decorator