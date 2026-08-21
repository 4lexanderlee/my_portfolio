import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")

# SUPABASE_SERVICE_KEY: usa la service_role key (no la anon key).
# La service_role key bypasses RLS y permite operaciones de escritura
# server-side sin restricciones. NUNCA exponerla al frontend.
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Fallback a la anon key para operaciones de solo lectura públicas
SUPABASE_ANON_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise ValueError("-> ERROR: NO SE ENCONTRO SUPABASE_URL")
if not SUPABASE_SERVICE_KEY and not SUPABASE_ANON_KEY:
    raise ValueError("-> ERROR: NO SE ENCONTRO SUPABASE_SERVICE_KEY ni SUPABASE_KEY")


def get_supabase() -> Client:
    """
    Cliente con service_role key para operaciones autenticadas (GET/PUT/POST/DELETE).
    Bypasses RLS — usar SOLO en el backend privado.
    """
    key = SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY
    return create_client(SUPABASE_URL, key)


def get_supabase_public() -> Client:
    """
    Cliente con anon key para operaciones públicas de solo lectura.
    Respeta RLS — equivalente al cliente del frontend.
    """
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)