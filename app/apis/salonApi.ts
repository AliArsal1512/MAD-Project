import { supabase } from "../credentials/supabaseClient";

// 🔐 Get current logged-in user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { error: error?.message || "User not found" };
  return { user: data.user };
}

// 🏪 Get salon profile by user ID
export async function getSalonProfile() {
  const { user, error } = await getCurrentUser();
  if (error || !user) return { error: error || "User not authenticated" };

  const { data, error: profileError } = await supabase
    .from("salons")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) return { error: profileError.message };
  return { profile: data };
}

// 📝 Update salon profile
export async function updateSalonProfile(updatedData: {
  salon_name?: string;
  address?: string;
  city?: string;
  email?:string;
  phone?: string;
  open_time?: string;
  close_time?: string;
  description?: string;
  ambience_images?: string[];
}) {
  const { user, error } = await getCurrentUser();
  if (error || !user) return { error: error || "User not authenticated" };

  const { error: updateError } = await supabase
    .from("salons")
    .update(updatedData)
    .eq("id", user.id);

  if (updateError) return { error: updateError.message };
  return { success: true };
}

// ➕ Add a new service for the current salon
export async function addService(serviceData: {
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
  }) {
    const { user, error } = await getCurrentUser();
    if (error || !user) return { error: error || "User not authenticated" };
  
    // First, get salon profile by user ID
    const { profile, error: profileError } = await getSalonProfile();
    if (profileError || !profile) return { error: profileError || "Salon not found" };
  
    // Insert service
    const { error: insertError } = await supabase.from("services").insert({
      salon_id: profile.id,
      name: serviceData.name,
      description: serviceData.description,
      duration_minutes: serviceData.duration_minutes,
      price: serviceData.price,
    });
  
    if (insertError) return { error: insertError.message };
    return { success: true };
  }
  
  export async function getServices() {
    const { user, error } = await getCurrentUser();
    if (error || !user) return { error: error || "User not authenticated" };
  
    // Fetch salon profile by user ID
    const { profile, error: profileError } = await getSalonProfile();
    if (profileError || !profile) return { error: profileError || "Salon profile not found" };
  
    // Fetch services for the salon
    const { data, error: servicesError } = await supabase
      .from("services")
      .select("*")
      .eq("salon_id", profile.id)
      .order("created_at", { ascending: false });
  
    if (servicesError) return { error: servicesError.message };
  
    return { services: data };
  }
  
  
// 📦 Get all salons
export async function getAllSalons() {
  const { data, error } = await supabase
    .from("salons")
    .select("*")
    .order("created_at", { ascending: false }); // Optional: latest first

  if (error) return { error: error.message };
  return { salons: data }; // ✅ renamed key for clarity
}



// 🔍 Get salon and its services by salon name
export async function getSalonWithServices(salon_name: string) {
  // Step 1: Fetch the salon
  const { data: salon, error: salonError } = await supabase
    .from("salons")
    .select("*")
    .eq("salon_name", salon_name)
    .single();

  if (salonError || !salon) {
    return { error: salonError?.message || "Salon not found" };
  }

  // Step 2: Fetch services for the salon using its ID
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .eq("salon_id", salon.id);

  if (servicesError) {
    return { error: servicesError.message };
  }

  return { salon, services };
}
