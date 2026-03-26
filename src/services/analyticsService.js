import { supabase } from "./supabaseClient";

// 7 last days visits
export const getVisitsLast7Days = async () => {
    const { data, error } = await supabase.rpc("get_visits_last_7_days");

    if (error) throw error;
    return data;
};

// Total visits
export const getTotalVisits = async () => {
  const { count, error } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
};

// actual day visits
export const getTodayVisits = async () => {
  const today = new Date().toISOString().split("T")[0];

  const { count, error } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today);

  if (error) throw error;
  return count;
};

// Tracking
export const trackVisit = async () => {
    try {
        await supabase.from("visits").insert([{}]);
    } catch (err) {
        console.error("Visit tracking error: ", err)
    }
};