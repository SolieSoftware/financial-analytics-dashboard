from core.cache import CacheManager
from services.redis_client import RedisClient
from utils.serializers import CacheSerializer
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CacheService:
    def __init__(self, redis_client: RedisClient, serializer: CacheSerializer):
        self.redis_client = redis_client
        self.cache = CacheManager(redis_client=redis_client, serializer=serializer)
