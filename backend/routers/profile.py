from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.database import get_supabase
from models.schemas import ProfileResponse, ProfileBase

# HTTPBearer le dice a FastAPI que esta ruta espera un token en los headers
security = HTTPBearer()

# Definimos el router con su prefijo
router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)

# Ruta pública: cualquiera puede ver el perfil
@router.get("/", response_model=list[ProfileResponse])
def get_profile():
    supabase = get_supabase()
    response = supabase.table("profile").select("*").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return response.data


# Ruta privada (protegida): solo el propietario puede editar
@router.put("/{profile_id}", response_model=ProfileResponse)
def update_profile(
    profile_id: str,
    profile_data: ProfileBase,
    # Al agregar 'creds = Depends(security)', FastAPI bloquea la ruta si no hay token
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    supabase = get_supabase()

    # mode='json' serializa EmailStr y otros tipos especiales a tipos nativos de Python/JSON
    # que Supabase/PostgreSQL puede procesar correctamente
    payload = profile_data.model_dump(mode='json')

    try:
        response = (
            supabase.table("profile")
            .update(payload)
            .eq("profile_id", profile_id)
            .execute()
        )
    except Exception as e:
        # Ahora sí mostramos el error real de Supabase/Python
        raise HTTPException(
            status_code=400,
            detail=f"Error actualizando perfil en la BD: {str(e)}"
        )

    # Verificar que la actualización devolvió datos
    if not response.data:
        raise HTTPException(
            status_code=404,
            detail=f"Perfil con profile_id={profile_id} no encontrado."
        )

    return response.data[0]