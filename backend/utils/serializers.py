import json
import gzip
import pickle
from typing import Any, Dict

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CacheSerializer:
    @staticmethod
    async def serialize_data(data: Dict[str, Any]) -> bytes:
        """Serialize data for Redis Storage with compression"""
        try:
            # Try pickle + gzip first
            pickled_data = pickle.dumps(data)
            compressed_data = gzip.compress(pickled_data)
            # Add a prefix to identify compressed data
            return b"COMPRESSED:" + compressed_data
        except Exception as e:
            logger.error(f"Error serializing data: {str(e)}")
            # Fallback to JSON without compression
            return b"JSON:" + json.dumps(data, default=str).encode()

    @staticmethod
    async def deserialize_data(data: bytes) -> Dict[str, Any]:
        """Deserialize data from Redis Storage with decompression"""
        try:
            # Data should always be bytes now with decode_responses=False
            if not isinstance(data, bytes):
                logger.warning(f"Expected bytes, got {type(data)}")
                return None

            # Check if data has a prefix
            if data.startswith(b"COMPRESSED:"):
                # Remove prefix and decompress
                compressed_data = data[11:]  # Remove 'COMPRESSED:' prefix
                try:
                    decompressed_data = gzip.decompress(compressed_data)
                    return pickle.loads(decompressed_data)
                except (gzip.BadGzipFile, pickle.UnpicklingError, ValueError) as e:
                    logger.warning(f"Failed to decompress/deserialize compressed data: {e}")
                    return None

            elif data.startswith(b"JSON:"):
                # Remove prefix and parse JSON
                json_data = data[5:]  # Remove 'JSON:' prefix
                try:
                    return json.loads(json_data.decode("utf-8"))
                except (json.JSONDecodeError, UnicodeDecodeError) as e:
                    logger.warning(f"Failed to parse JSON data: {e}")
                    return None

            else:
                # Try legacy format (no prefix) - this is likely old cached data
                try:
                    decompressed_data = gzip.decompress(data)
                    return pickle.loads(decompressed_data)
                except (gzip.BadGzipFile, pickle.UnpicklingError, ValueError):
                    # Fallback to JSON
                    try:
                        return json.loads(data.decode("utf-8"))
                    except (json.JSONDecodeError, UnicodeDecodeError):
                        logger.warning(
                            "Failed to deserialize legacy data - clearing cache entry"
                        )
                        return None

        except Exception as e:
            logger.error(f"Error deserializing data: {str(e)}")
            return None