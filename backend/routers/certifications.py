from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.database import get_supabase
from models.schemas import CertificationCreate, CertificationUpdate, CertificationResponse
from uuid import UUID

security = HTTPBearer()

router = APIRouter(
    prefix="/api/certifications",
    tags=["Certifications"]
)

@router.get("/", response_model=list[CertificationResponse])
def get_certifications():
    supabase = get_supabase()
    response = supabase.table("certifications").select("*").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No se encontraron certificaciones")
    return response.data

@router.post("/", response_model=CertificationResponse)
def create_certification(
    cert_data: CertificationCreate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("certifications").insert(cert_data.model_dump(mode="json")).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear la certificación")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creando certificación: {str(e)}")

@router.put("/{id}", response_model=CertificationResponse)
def update_certification(
    id: UUID,
    cert_data: CertificationUpdate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    update_data = cert_data.model_dump(exclude_unset=True, mode="json")
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")

    try:
        response = supabase.table("certifications").update(update_data).eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Certificación no encontrada o sin permisos")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error actualizando certificación: {str(e)}")

@router.delete("/{id}")
def delete_certification(
    id: UUID,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("certifications").delete().eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Certificación no encontrada o sin permisos")
        return {"message": "Certificación eliminada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error eliminando certificación: {str(e)}")
