import { supabase } from "./supabaseClient";

// Récupère le contenu de la section "about"
export const getAboutContent = async () => {
  const { data, error } = await supabase
    .from("home_content")
    .select("about_title, about_text, about_image_url")
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

// Met à jour le contenu de la section "about"
export const updateAboutContent = async (payload) => {
  // payload = { about_title, about_text, about_image_url }
  const { data, error } = await supabase
    .from("home_content")
    .upsert({ id: payload.id || undefined, ...payload, created_at: new Date() })
    .select()
    .single();

  if (error) throw error;
  return data;
};
