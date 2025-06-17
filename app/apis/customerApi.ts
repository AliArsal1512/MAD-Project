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