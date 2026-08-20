from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.database import get_supabase
from models.schemas import TrainingCreate, TrainingUpdate, TrainingResponse
from uuid import UUID

security = HTTPBearer()

router = APIRouter(
    prefix="/api/training",
    tags=["Training"]
)

@router.get("/", response_model=list[TrainingResponse])
def get_trainings():
    supabase = get_supabase()
    response = supabase.table("training").select("*").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No se encontró formación académica")
    return response.data

@router.post("/", response_model=TrainingResponse)
def create_training(
    training_data: TrainingCreate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("training").insert(training_data.model_dump(mode="json")).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear la formación")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creando formación: {str(e)}")

@router.put("/{id}", response_model=TrainingResponse)
def update_training(
    id: UUID,
    training_data: TrainingUpdate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    update_data = training_data.model_dump(exclude_unset=True, mode="json")
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")

    try:
        response = supabase.table("training").update(update_data).eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Formación no encontrada o sin permisos")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error actualizando formación: {str(e)}")

@router.delete("/{id}")
def delete_training(
    id: UUID,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("training").delete().eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Formación no encontrada o sin permisos")
        return {"message": "Formación eliminada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error eliminando formación: {str(e)}")
