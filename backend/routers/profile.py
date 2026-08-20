from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.database import get_supabase
from models.schemas import ProfileResponse, ProfileBase

# HTTPBaerer le dice a FASTAPI que esta ruta espera un token en los headers
security = HTTPBearer()

# Definimos el router con su prefijo
router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)
# ruta pública : cualquiera puede ver el perfil
@router.get("/", response_model=list[ProfileResponse])
def get_profile():
    supabase = get_supabase()

    response = supabase.table("profile").select("*").execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return response.data

# ruto privada (Protegida): Solo el propietario puede editar
@router.put("/{profile_id}", response_model=ProfileResponse)
def update_profile(
    profile_id: str,
    profile_data: ProfileBase,
    # Al agregar 'creds = Depends(security)', FastAPI bloquea la ruta si no hay token
    creds: HTTPAuthorizationCredentials = Depends(security) 
):
    supabase = get_supabase()
    
    # .model_dump() convierte el modelo Pydantic a un diccionario que Supabase entiende
    # .eq() es el equivalente a la cláusula WHERE en SQL
    try:
        response = supabase.table("profile").update(profile_data.model_dump()).eq("profile_id", profile_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Perfil a actualizar no encontrado")
        return response.data[0]
    except:
        raise HTTPException(status_code=400, detail="Error actualizando perfil: {str(e)}")