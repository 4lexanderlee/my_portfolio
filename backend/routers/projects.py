from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.database import get_supabase
from models.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from uuid import UUID

security = HTTPBearer()

router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"]
)

@router.get("/", response_model=list[ProjectResponse])
def get_projects():
    supabase = get_supabase()
    response = supabase.table("projects").select("*").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No se encontraron proyectos")
    return response.data

@router.post("/", response_model=ProjectResponse)
def create_project(
    project_data: ProjectCreate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("projects").insert(project_data.model_dump(mode="json")).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el proyecto")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creando proyecto: {str(e)}")

@router.put("/{id}", response_model=ProjectResponse)
def update_project(
    id: UUID,
    project_data: ProjectUpdate,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    update_data = project_data.model_dump(exclude_unset=True, mode="json")
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")

    try:
        response = supabase.table("projects").update(update_data).eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado o sin permisos")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error actualizando proyecto: {str(e)}")

@router.delete("/{id}")
def delete_project(
    id: UUID,
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()
    supabase.auth.set_session(creds.credentials, "")
    
    try:
        response = supabase.table("projects").delete().eq("id", str(id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado o sin permisos")
        return {"message": "Proyecto eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error eliminando proyecto: {str(e)}")
