import { supabase } from '../lib/supabase';

/**
 * Sube un archivo al bucket público 'portfolio' en Supabase Storage.
 * @param file   - Archivo a subir
 * @param folder - Subcarpeta dentro del bucket (ej. 'projects', 'cv', 'certifications')
 * @returns      - URL pública del archivo subido
 */
export async function uploadFile(file: File, folder: string = 'general'): Promise<string> {
  const ext = file.name.split('.').pop();
  const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `${folder}/${uniqueName}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    console.error('[Storage] Error uploading file:', uploadError);
    throw new Error(`No se pudo subir el archivo: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error('No se pudo obtener la URL pública del archivo');
  }

  return data.publicUrl;
}

/** Alias para imágenes */
export const uploadImage = (file: File, folder: string = 'images') =>
  uploadFile(file, folder);
