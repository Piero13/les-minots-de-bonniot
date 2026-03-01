import { supabase } from "./supabaseClient";

export const getAboutContent = async () => {
  const { data, error } = await supabase
    .from("home_content")
    .select("*")   // IMPORTANT
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateAboutContent = async (payload) => {
  if (payload.id) {
    // UPDATE
    const { data, error } = await supabase
      .from("home_content")
      .update({
        about_title: payload.about_title,
        about_text: payload.about_text,
        about_image_url: payload.about_image_url,
      })
      .eq("id", payload.id)
      .select()
      .single();

    if (error) throw error;
    return data;

  } else {
    // INSERT (première fois seulement)
    const { data, error } = await supabase
      .from("home_content")
      .insert({
        about_title: payload.about_title,
        about_text: payload.about_text,
        about_image_url: payload.about_image_url,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};