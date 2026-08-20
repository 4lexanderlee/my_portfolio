from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import profile

app = FastAPI(title="Portfolio API")

# Configurar CORS para permitir que tu frontend en React (Vite) se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Registramos el router en la app
app.include_router(profile.router)

@app.get("/")
def read_root():
    return {"status": "API online", "message": "Backend operativo"}