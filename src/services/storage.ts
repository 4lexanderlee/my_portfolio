import { supabase } from '../lib/supabase';

/**
 * Subir una imagen al bucket público de Supabase y devolver su URL.
 * @param file - Archivo de imagen
 * @param folder - Carpeta dentro del bucket (ej. "projects", "certifications")
 * @returns - URL pública del archivo subido
 */
export async function uploadImage(file: File, folder: string = 'general'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Subir el archivo
  const { error: uploadError } = await supabase.storage
    .from('portfolio')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error('No se pudo subir la imagen');
  }

  // Obtener URL pública
  const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);

  if (!data || !data.publicUrl) {
    throw new Error('No se pudo obtener la URL pública de la imagen');
  }

  return data.publicUrl;
}
