import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qhcbaqgbakuqpwzmkbrg.supabase.co";
const supabaseKey = "sb_publishable_CPrPS3FBiw4kKeyWWz__NQ_h4gOFGZd";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadVideo(file: File): Promise<string | null> {
  const fileName = `videos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const { error } = await supabase.storage
    .from("property-videos")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabase.storage.from("property-videos").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteVideo(path: string): Promise<void> {
  const urlParts = path.split("/property-videos/");
  if (urlParts.length < 2) return;
  const filePath = urlParts[1];
  await supabase.storage.from("property-videos").remove([filePath]);
}