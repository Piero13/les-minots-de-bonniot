import { supabase } from "./supabaseClient";

// 🔹 Get all events
export const getEvents = async (archived = false) => {
  // 1️⃣ Archive old events
  await archivePastEvents();

  // 2️⃣ Get filtered events
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("archived", archived)
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
};

// 🔹 Add event
export const addEvent = async (event) => {
  const { data, error } = await supabase
    .from("events")
    .insert([event], { returning: "representation" });
  if (error) throw error;
  if (!data || data.length === 0) return { id: null, ...event };
  return data[0];
};

// 🔹 Update event
export const updateEvent = async (id, updatedEvent) => {
  if (!id) throw new Error("ID manquant pour l'update");
  const { data, error } = await supabase
    .from("events")
    .update(updatedEvent, { returning: "representation" })
    .eq("id", id); // ← UUID string, pas de Number()
  if (error) throw error;
  return data && data.length > 0 ? data[0] : { id, ...updatedEvent };
};

// 🔹 Delete event
export const deleteEvent = async (id) => {
  if (!id) throw new Error("ID manquant pour delete");
  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", id); // ← UUID string
  if (error) throw error;
  if (!data || data.length === 0) console.warn(`Aucune ligne supprimée pour id=${id}`);
  return data;
};

// 🔹 Auto-archive past events
export const archivePastEvents = async () => {
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .update({ archived: true })
    .lt("date", today)
    .eq("archived", false)
    .select();

  if (error) {
    console.error("Erreur auto-archivage :", error);
    return [];
  }

  return data;
};


export const getPublicEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("archived", false)
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
};

export const getNextEvents = async (limit = 3) => {
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("archived", false)
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
};

// eventsService.js
export const getCalendarEvents = async () => {
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("archived", false)
    .gte("date", today)
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
};
