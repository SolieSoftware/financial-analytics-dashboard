import os
import logging

from supabase import create_client, Client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SupabaseClient:
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.supabase: Client = None

    async def init_supabase(self):
        """Initialize the Supabase client"""
        try:
            self.supabase = create_client(self.supabase_url, self.supabase_key)
            logger.info("Supabase client initialized")
        except Exception as e:
            logger.error(f"Error initializing Supabase client: {str(e)}")
            raise e

    async def close_supabase(self):
        """Close the Supabase client"""
        if self.supabase:
            # Supabase client doesn't have a close method
            self.supabase = None
            logger.info("Supabase client closed")
