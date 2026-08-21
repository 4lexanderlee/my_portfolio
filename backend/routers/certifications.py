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
    try:
        response = get_supabase().table("certifications").select("*").execute()
        if not response.data:
            return []
        
        # Mapear certification_id a id para que coincida con CertificationResponse
        mapped_data = []
        for row in response.data:
            if "certification_id" in row and "id" not in row:
                row["id"] = row.pop("certification_id")
            mapped_data.append(row)
            
        return mapped_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error obteniendo certificaciones: {str(e)}")

@router.post("/", response_model=CertificationResponse)
def create_certification(
    cert_data: CertificationCreate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    payload = cert_data.model_dump(mode="json")
    if not payload.get("profile_id"):
        # Obtener profile_id de la tabla profile
        resp = supabase.table("profile").select("profile_id").limit(1).execute()
        if not resp.data:
            raise HTTPException(status_code=404, detail="Perfil no encontrado para asociar")
        payload["profile_id"] = resp.data[0]["profile_id"]

    try:
        response = supabase.table("certifications").insert(payload).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear la certificación")
            
        created_row = response.data[0]
        if "certification_id" in created_row and "id" not in created_row:
            created_row["id"] = created_row.pop("certification_id")
            
        return created_row
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
    try:
        response = supabase.table("certifications").update(update_data).eq("certification_id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Certificación no encontrada")
            
        updated_row = response.data[0]
        if "certification_id" in updated_row and "id" not in updated_row:
            updated_row["id"] = updated_row.pop("certification_id")
            
        return updated_row
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
        response = supabase.table("certifications").delete().eq("certification_id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Certificación no encontrada")
        return {"message": "Certificación eliminada"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error eliminando certificación: {str(e)}")
