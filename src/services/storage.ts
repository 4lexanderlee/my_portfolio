import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

/**
 * Sube un archivo al backend (FastAPI), que a su vez lo sube a Supabase Storage
 * usando la service_role key para bypassar el RLS del bucket.
 *
 * @param file   - Archivo a subir (PDF, imagen, etc.)
 * @param folder - Subcarpeta dentro del bucket (ej. 'cv', 'projects', 'cert-icons')
 * @returns      - URL pública del archivo subido
 */
export async function uploadFile(file: File, folder: string = 'general'): Promise<string> {
  // Obtener el token de sesión actual para autenticar la petición al backend
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('No hay sesión activa. Por favor inicia sesión primero.');
  }

  // Construir FormData con el archivo
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload/${folder}`, {
    method: 'POST',
    headers: {
      // NO incluir 'Content-Type' — el browser lo pone automáticamente con el boundary
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(`No se pudo subir el archivo: ${body.detail ?? `HTTP ${res.status}`}`);
  }

  const result = await res.json() as { url: string; path: string };

  if (!result.url) {
    throw new Error('El servidor no devolvió una URL válida para el archivo.');
  }

  return result.url;
}

/** Alias semántico para subir imágenes */
export const uploadImage = (file: File, folder: string = 'images') =>
  uploadFile(file, folder);
