from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.database import get_supabase
from models.schemas import IamCreate, IamUpdate, IamResponse
from uuid import UUID

security = HTTPBearer()

router = APIRouter(
    prefix="/api/iam",
    tags=["IAM"]
)


@router.get("/", response_model=list[IamResponse])
def get_iam():
    """Ruta pública — lista todas las ocupaciones."""
    supabase = get_supabase()
    response = supabase.table("iam").select("*").execute()
    return response.data or []


@router.post("/", response_model=IamResponse)
def create_iam(
    data: IamCreate,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    try:
        resp = supabase.table("iam").insert(data.model_dump(mode="json")).execute()
        if not resp.data:
            raise HTTPException(status_code=400, detail="No se pudo crear la ocupación")
        return resp.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creando ocupación: {str(e)}")


@router.put("/{iam_id}", response_model=IamResponse)
def update_iam(
    iam_id: UUID,
    data: IamUpdate,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    update_data = data.model_dump(exclude_unset=True, mode="json")
    if not update_data:
        raise HTTPException(status_code=400, detail="Sin datos para actualizar")
    try:
        resp = (
            supabase.table("iam")
            .update(update_data)
            .eq("iam_id", str(iam_id))
            .execute()
        )
        if not resp.data:
            raise HTTPException(status_code=404, detail="Ocupación no encontrada")
        return resp.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error actualizando ocupación: {str(e)}")


@router.delete("/{iam_id}")
def delete_iam(
    iam_id: UUID,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    try:
        resp = supabase.table("iam").delete().eq("iam_id", str(iam_id)).execute()
        if not resp.data:
            raise HTTPException(status_code=404, detail="Ocupación no encontrada")
        return {"message": "Ocupación eliminada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error eliminando ocupación: {str(e)}")
