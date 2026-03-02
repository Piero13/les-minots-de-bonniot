import { supabase } from "./supabaseClient";

// Ajouter un message depuis le formulaire
export const addMessage = async (data) => {
  const { data: result, error } = await supabase
    .from("db_messages")
    .insert([data])
    .select()
    .single();
  if (error) throw error;
  return result;
};

// Récupérer tous les db_messages (admin)
export const getMessages = async () => {
  const { data, error } = await supabase
    .from("db_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Marquer message comme lu/non-lu
export const markAsRead = async (id, is_read) => {
  const { data, error } = await supabase
    .from("db_messages")
    .update({ is_read })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Supprimer un message
export const deleteMessage = async (id) => {
  const { error } = await supabase
    .from("db_messages")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

// Compter les db_messages non lus
export const getUnreadMessagesCount = async () => {
  const { count, error } = await supabase
    .from("db_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) throw error;
  return count;
};
