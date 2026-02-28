import { supabase } from "./supabaseClient";

// GET
export const getTeamPictures = async () => {
  const { data, error } = await supabase
    .from("team_pictures")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// ADD
export const addTeamPicture = async (payload) => {
  const { data, error } = await supabase
    .from("team_pictures")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// UPDATE
export const updateTeamPicture = async (id, payload) => {
  const { data, error } = await supabase
    .from("team_pictures")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// DELETE
export const deleteTeamPicture = async (id) => {
  const { error } = await supabase
    .from("team_pictures")
    .delete()
    .eq("id", id);

  if (error) throw error;
};