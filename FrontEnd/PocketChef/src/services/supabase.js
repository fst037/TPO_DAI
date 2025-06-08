import { createClient } from '@supabase/supabase-js';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

const supabaseUrl = 'https://zwmvswwoqpbsswdpybwu.supabase.co'; // <-- Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bXZzd3dvcXBic3N3ZHB5Ynd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNzQ4MTksImV4cCI6MjA2NDg1MDgxOX0._CDFWe9Hn-t0z9EQF8gB68mVhwZkr2X_AkDBEeN1FFk'; // <-- Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (fileUri) => {
  try {
    // Read the image as a base64 string
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Decode the base64 string into an ArrayBuffer
    const arrayBuffer = decode(base64);

    // Determine the file extension and name
    const fileExt = fileUri.split('.').pop().split('?')[0];
    const fileName = `${Date.now()}.${fileExt || 'jpg'}`;

    // Upload the ArrayBuffer to Supabase Storage
    const { data, error } = await supabase.storage
      .from('pocket-chef-avatars')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    // Retrieve the public URL of the uploaded image
    const { data: urlData, error: urlError } = supabase
      .storage
      .from('pocket-chef-avatars')
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    return urlData.publicUrl;
  } catch (err) {
    throw new Error(`Error uploading image: ${err.message}`);
  }
}
