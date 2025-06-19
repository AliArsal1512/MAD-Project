import { supabase } from "../credentials/supabaseClient";

// 🔐 Get current logged-in user
export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return { error: error?.message || "User not found" };
    return { user: data.user };
  }

  export async function fetchCustomerAppointments() {
    const { user, error: userError } = await getCurrentUser();
    if (userError || !user) return { error: userError || "User not logged in", data: null };
  
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        status,
        expires_at,
        salons (
          salon_name,
          address,
          city,
          average_rating
        )
      `)
      .eq("customer_id", user.id)
      .order("appointment_date", { ascending: true });
  
    if (error) return { error: error.message, data: null };
  
    // Format response for UI
    console.log(data)
    const formatted = data.map((a: any) => ({
      id: a.id,
      barberName: a.salons.salon_name,
      address: a.salons.address,
      city:a.salons.city,
      status:a.status,
      expiresAt: a.expires_at,
      rating: a.salons.average_rating,
      time: `${a.start_time.slice(0, 5)} on ${a.appointment_date}`, // e.g. "10:00 on 2025-06-15"
    }));
  
    return { data: formatted, error: null };
  }

export async function getCurrentCustomerProfile() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: authError?.message || "User not authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles") // or "profiles" if you're still using old name
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) return { error: profileError.message };

  return { profile };
}


export async function editCustomerProfile(updatedData: {
  full_name?: string;
  phone?: string;
  gender?: string;
  email?: string;
  avatar_url?: string;
}) {
  const { user, error } = await getCurrentUser();
  if (error || !user) return { error: error || "User not authenticated" };

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updatedData)
    .eq("id", user.id);

  if (updateError) return { error: updateError.message };
  return { success: true };
}