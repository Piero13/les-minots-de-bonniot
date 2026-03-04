import { supabase } from "../supabaseClient";

export const sendContactMessage = async (message) => {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert([message])
    .select();

  if (error) {
    console.error("Erreur insertion contact:", error);
    throw error;
  }

  return data;
};