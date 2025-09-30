from pydantic import BaseModel
import redis.asyncio as redis
import json
from typing import Optional, List
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
                decode_responses=True,
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
            