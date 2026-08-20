import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise ValueError("- > ERROR: NO SE ENCONTRO SUPABASE_URL")
if not SUPABASE_KEY:
    raise ValueError("- > ERROR: NO SE ENCONTRO SUPABASE_KEY")
def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)