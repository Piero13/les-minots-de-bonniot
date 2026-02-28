import { supabase } from "./supabaseClient";

// Récupérer docs
export const getLegalDocs = async () => {
  const { data, error } = await supabase
    .from("legal_documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Ajouter doc
export const addLegalDoc = async (doc) => {
  const { data, error } = await supabase
    .from("legal_documents")
    .insert([doc])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Supprimer doc
export const deleteLegalDoc = async (id) => {
  const { error } = await supabase
    .from("legal_documents")
    .delete()
    .eq("id", id);

  if (error) throw error;
};