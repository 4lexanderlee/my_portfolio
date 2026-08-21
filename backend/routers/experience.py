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


def _attach_responsibilities(supabase, experience_id: str) -> list:
    """Consulta las responsabilidades de una experiencia ordenadas."""
    resp = (
        supabase.table("responsibility")
        .select("*")
        .eq("experience_id", experience_id)
        .order("order")
        .execute()
    )
    return resp.data or []


@router.get("/", response_model=list[ExperienceResponse])
def get_experiences():
    supabase = get_supabase()
    exp_resp = supabase.table("experience").select("*").execute()
    experiences = exp_resp.data or []
    for exp in experiences:
        exp["responsibilities"] = _attach_responsibilities(supabase, exp["id"])
    return experiences


@router.post("/", response_model=ExperienceResponse)
def create_experience(
    experience_data: ExperienceCreate,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")

    # Separar responsabilidades del payload principal
    responsibilities = experience_data.responsibilities
    exp_payload = experience_data.model_dump(
        exclude={"responsibilities"}, mode="json"
    )

    try:
        exp_resp = supabase.table("experience").insert(exp_payload).execute()
        if not exp_resp.data:
            raise HTTPException(status_code=400, detail="No se pudo crear la experiencia")
        created = exp_resp.data[0]
        exp_id = created["id"]

        # Insertar responsabilidades
        if responsibilities:
            resp_rows = [
                {"experience_id": exp_id, "description": r.description, "order": r.order}
                for r in responsibilities
            ]
            supabase.table("responsibility").insert(resp_rows).execute()

        created["responsibilities"] = _attach_responsibilities(supabase, exp_id)
        return created
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creando experiencia: {str(e)}")


@router.put("/{id}", response_model=ExperienceResponse)
def update_experience(
    id: UUID,
    experience_data: ExperienceUpdate,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")

    responsibilities = experience_data.responsibilities
    update_data = experience_data.model_dump(
        exclude={"responsibilities"}, exclude_unset=True, mode="json"
    )

    try:
        if update_data:
            exp_resp = (
                supabase.table("experience")
                .update(update_data)
                .eq("id", str(id))
                .execute()
            )
            if not exp_resp.data:
                raise HTTPException(status_code=404, detail="Experiencia no encontrada")
            updated = exp_resp.data[0]
        else:
            # Sin campos de experiencia que actualizar, solo leer el registro
            existing = supabase.table("experience").select("*").eq("id", str(id)).execute()
            if not existing.data:
                raise HTTPException(status_code=404, detail="Experiencia no encontrada")
            updated = existing.data[0]

        # Actualizar responsabilidades: borrar y re-insertar
        if responsibilities is not None:
            supabase.table("responsibility").delete().eq("experience_id", str(id)).execute()
            if responsibilities:
                resp_rows = [
                    {"experience_id": str(id), "description": r.description, "order": r.order}
                    for r in responsibilities
                ]
                supabase.table("responsibility").insert(resp_rows).execute()

        updated["responsibilities"] = _attach_responsibilities(supabase, str(id))
        return updated
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error actualizando experiencia: {str(e)}")


@router.delete("/{id}")
def delete_experience(
    id: UUID,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    try:
        # Borrar responsabilidades primero (integridad referencial si no hay CASCADE)
        supabase.table("responsibility").delete().eq("experience_id", str(id)).execute()
        resp = supabase.table("experience").delete().eq("id", str(id)).execute()
        if not resp.data:
            raise HTTPException(status_code=404, detail="Experiencia no encontrada")
        return {"message": "Experiencia eliminada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error eliminando experiencia: {str(e)}")
