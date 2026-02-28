import { supabase } from "./supabaseClient";

// GET ALL
export const getHomeBanners = async () => {
  const { data, error } = await supabase
    .from("home_banners")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// GET ACTIVE
export const getActiveBanner = async () => {
  const { data, error } = await supabase
    .from("home_banners")
    .select("*")
    .eq("active_banner", true)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ADD
export const addHomeBanner = async (payload) => {
  const { data, error } = await supabase
    .from("home_banners")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ACTIVATE banner using RPC
export const activateBanner = async (id) => {
  const { error } = await supabase.rpc("set_active_banner", { banner_id: id });
  if (error) throw error;
};

// DELETE
export const deleteHomeBanner = async (id) => {
  const { error } = await supabase
    .from("home_banners")
    .delete()
    .eq("id", id);

  if (error) throw error;
};