import redis.asyncio as redis
from typing import Optional, Dict, Any
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RedisClient:
    def __init__(self):
        self.redis: Optional[redis.Redis] = None

    async def init_redis(self):
        """Initialize the Redis client"""
        try:
            self.redis = redis.Redis(
                host="localhost",
                port=6379,
                db=0,
                decode_responses=False,  # Keep binary data as bytes
                retry_on_timeout=True,
            )
            logger.info("Redis client initialized")

            await self.redis.ping()
            logger.info("Redis Connected Successfully")
        except Exception as e:
            logger.error(f"Error initializing Redis client: {str(e)}")
            raise e

    async def close_redis(self):
        """Close Redis Connection"""
        if self.redis:
            await self.redis.close()
            logger.info("Redis Connection Closed Successfully")

    async def get_stats(self) -> Dict[str, Any]:
        """
        Get comprehensive Redis cache statistics
        
        Returns:
            Dictionary with cache stats including:
            - total_keys
            - memory_used
            - hit_rate
            - cache_hits/misses
            - evicted/expired keys
            
        Example:
            stats = await redis_client.get_stats()
            print(f"Hit rate: {stats['hit_rate']}")
        """
        info = await self.redis.info()
        memory = await self.redis.info('memory')
        stats = await self.redis.info('stats')
        
        hits = stats.get('keyspace_hits', 0)
        misses = stats.get('keyspace_misses', 0)
        total = hits + misses
        
        return {
            'total_keys': await self.redis.dbsize(),
            'memory_used': memory['used_memory_human'],
            'memory_used_bytes': memory['used_memory'],
            'memory_peak': memory['used_memory_peak_human'],
            'hit_rate': f"{(hits/total*100):.2f}%" if total > 0 else "0%",
            'cache_hits': hits,
            'cache_misses': misses,
            'evicted_keys': stats.get('evicted_keys', 0),
            'expired_keys': stats.get('expired_keys', 0),
            'connected_clients': info['connected_clients'],
            'uptime_days': info['uptime_in_days']
        }
