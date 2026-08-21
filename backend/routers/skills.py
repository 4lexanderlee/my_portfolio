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


def _get_profile_id(supabase) -> str:
    """Obtiene el profile_id del único registro de la tabla profile."""
    resp = supabase.table("profile").select("profile_id").limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Perfil no encontrado para asociar")
    return resp.data[0]["profile_id"]


@router.get("/", response_model=list[SkillResponse])
def get_skills():
    """Ruta pública — lista todas las habilidades."""
    supabase = get_supabase()
    response = supabase.table("skills").select("*").execute()
    data = response.data or []
    for item in data:
        if "skill_id" in item:
            item["id"] = item["skill_id"]
    return data


@router.post("/", response_model=SkillResponse)
def create_skill(
    skill_data: SkillCreate,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    supabase = get_supabase()

    # Auto-inyectar profile_id desde la BD (el frontend no lo envía)
    payload = skill_data.model_dump(mode="json")
    if not payload.get("profile_id"):
        payload["profile_id"] = _get_profile_id(supabase)

    try:
        response = supabase.table("skills").insert(payload).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear la habilidad")
        data = response.data[0]
        data["id"] = data.get("skill_id")
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creando habilidad: {str(e)}")


@router.put("/{id}", response_model=SkillResponse)
def update_skill(
    id: UUID,
    skill_data: SkillUpdate,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    supabase = get_supabase()
    update_data = skill_data.model_dump(exclude_unset=True, mode="json")
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")

    try:
        response = supabase.table("skills").update(update_data).eq("skill_id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Habilidad no encontrada")
        data = response.data[0]
        data["id"] = data.get("skill_id")
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error actualizando habilidad: {str(e)}")


@router.delete("/{id}")
def delete_skill(
    id: UUID,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    supabase = get_supabase()
    try:
        response = supabase.table("skills").delete().eq("skill_id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Habilidad no encontrada")
        return {"message": "Habilidad eliminada correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error eliminando habilidad: {str(e)}")
