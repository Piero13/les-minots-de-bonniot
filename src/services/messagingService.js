import { supabase } from "./supabaseClient";

/**
 * Envoyer un message (public)
 */
export const sendContactMessage = async (message) => {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert([message])
    .select()
    .single();

  if (error) {
    console.error("Erreur insertion contact:", error);
    throw error;
  }

  return data;
};

/**
 * Récupérer tous les messages (admin)
 */
export const getMessages = async () => {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération messages:", error);
    throw error;
  }

  return data;
};

/**
 * Marquer un message comme lu (admin)
 */
export const markAsRead = async (id) => {
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur update message:", error);
    throw error;
  }

  return data;
};

/**
 * Supprimer un message (admin)
 */
export const deleteMessage = async (id) => {
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur suppression message:", error);
    throw error;
  }

  return true;
};