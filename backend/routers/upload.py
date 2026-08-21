import os
import uuid
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.database import get_supabase

security = HTTPBearer()

router = APIRouter(
    prefix="/api/upload",
    tags=["Upload"]
)

# Tipos de archivo permitidos por carpeta
ALLOWED_TYPES: dict[str, list[str]] = {
    "cv":           ["application/pdf"],
    "projects":     ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    "project-icons":["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    "cert-icons":   ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    "images":       ["image/png", "image/jpeg", "image/webp"],
    "general":      [],  # sin restricción
}

BUCKET_NAME = "portfolio"


@router.post("/{folder}")
async def upload_file(
    folder: str,
    file: UploadFile = File(...),
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Sube un archivo al bucket 'portfolio' en la subcarpeta indicada.
    Usa la service_role key del backend → bypassa RLS del Storage.
    Devuelve: { "url": "https://..." }
    """
    # Validar tipo de contenido si la carpeta tiene restricciones
    allowed = ALLOWED_TYPES.get(folder, [])
    if allowed and file.content_type not in allowed:
        raise HTTPException(
            status_code=415,
            detail=f"Tipo de archivo no permitido en '{folder}'. Permitidos: {allowed}"
        )

    # Generar nombre único para evitar colisiones
    ext = os.path.splitext(file.filename or "file")[1] or ".bin"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = f"{folder}/{unique_name}"

    # Leer contenido del archivo
    content = await file.read()

    supabase = get_supabase()  # usa service_role key → bypassa Storage RLS

    # Subir al bucket
    response = supabase.storage.from_(BUCKET_NAME).upload(
        file_path,
        content,
        file_options={
            "content-type": file.content_type or "application/octet-stream",
            "cache-control": "3600",
            "upsert": "false",
        },
    )

    # El cliente de supabase-py v2 lanza excepción si falla el upload;
    # si no, `response` contiene el path del archivo subido.
    if hasattr(response, "error") and response.error:
        raise HTTPException(
            status_code=400,
            detail=f"Error subiendo archivo a Storage: {response.error}"
        )

    # Obtener URL pública
    public_url_data = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)

    # get_public_url devuelve directamente la URL como string en supabase-py v2
    public_url = public_url_data if isinstance(public_url_data, str) else public_url_data.get("publicUrl", "")

    if not public_url:
        raise HTTPException(status_code=500, detail="No se pudo obtener la URL pública del archivo")

    return {"url": public_url, "path": file_path}
