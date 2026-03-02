import { supabase } from "./supabaseClient";

// Ajouter un message depuis le formulaire
export const addMessage = async (data) => {
  const { error, data: result } = await supabase
    .from("messages")
    .insert([data])
    .select()
    .single();
  console.log(supabase);
  if (error) throw error;
  return result;
};

// Récupérer tous les messages (admin)
export const getMessages = async () => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Marquer message comme lu/non-lu
export const markAsRead = async (id, is_read) => {
  const { data, error } = await supabase
    .from("messages")
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
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

// Compter les messages non lus
export const getUnreadMessagesCount = async () => {
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) throw error;
  return count;
};
