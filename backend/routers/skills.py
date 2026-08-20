from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.database import get_supabase
from models.schemas import SkillCreate, SkillUpdate, SkillResponse
from uuid import UUID

security = HTTPBearer()

router = APIRouter(
    prefix="/api/skills",
    tags=["Skills"]
)

@router.get("/", response_model=list[SkillResponse])
def get_skills():
    supabase = get_supabase()
    response = supabase.table("skills").select("*").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No se encontraron habilidades")
    return response.data

@router.post("/", response_model=SkillResponse)
def create_skill(
    skill_data: SkillCreate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("skills").insert(skill_data.model_dump(mode="json")).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear la habilidad")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creando habilidad: {str(e)}")

@router.put("/{id}", response_model=SkillResponse)
def update_skill(
    id: UUID,
    skill_data: SkillUpdate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    update_data = skill_data.model_dump(exclude_unset=True, mode="json")
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")

    try:
        response = supabase.table("skills").update(update_data).eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Habilidad no encontrada o sin permisos")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error actualizando habilidad: {str(e)}")

@router.delete("/{id}")
def delete_skill(
    id: UUID,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("skills").delete().eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Habilidad no encontrada o sin permisos")
        return {"message": "Habilidad eliminada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error eliminando habilidad: {str(e)}")
