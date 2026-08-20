from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.database import get_supabase
from models.schemas import ExperienceCreate, ExperienceUpdate, ExperienceResponse
from uuid import UUID

security = HTTPBearer()

router = APIRouter(
    prefix="/api/experience",
    tags=["Experience"]
)

@router.get("/", response_model=list[ExperienceResponse])
def get_experiences():
    supabase = get_supabase()
    response = supabase.table("experience").select("*").execute()
    if not response.data:
        # Return empty list instead of 404 is usually better, but keeping 404 as requested
        raise HTTPException(status_code=404, detail="No se encontraron registros de experiencia")
    return response.data

@router.post("/", response_model=ExperienceResponse)
def create_experience(
    experience_data: ExperienceCreate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("experience").insert(experience_data.model_dump(mode="json")).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el registro")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creando experiencia: {str(e)}")

@router.put("/{id}", response_model=ExperienceResponse)
def update_experience(
    id: UUID,
    experience_data: ExperienceUpdate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    # Exclude unset values to only update provided fields
    update_data = experience_data.model_dump(exclude_unset=True, mode="json")
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")

    try:
        response = supabase.table("experience").update(update_data).eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Registro no encontrado o sin permisos")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error actualizando experiencia: {str(e)}")

@router.delete("/{id}")
def delete_experience(
    id: UUID,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("experience").delete().eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Registro no encontrado o sin permisos")
        return {"message": "Registro eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error eliminando experiencia: {str(e)}")
