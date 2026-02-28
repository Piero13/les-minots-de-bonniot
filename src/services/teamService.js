import { supabase } from "./supabaseClient";

// Récupérer tous les membres
export const getTeamMembers = async () => {
  const { data, error } = await supabase
    .from("team")
    .select("*")
    .order("last_name", { ascending: true });
  if (error) throw error;
  return data;
};

// Ajouter un membre
export const addTeamMember = async (payload) => {
  const { data, error } = await supabase.from("team").insert([payload]).select().single();
  if (error) throw error;
  return data;
};

// Mettre à jour un membre
export const updateTeamMember = async (id, payload) => {
  const { data, error } = await supabase.from("team").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

// Supprimer un membre
export const deleteTeamMember = async (id) => {
  const { data, error } = await supabase.from("team").delete().eq("id", id);
  if (error) throw error;
  return data;
};
