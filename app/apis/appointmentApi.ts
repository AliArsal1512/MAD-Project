import { supabase } from "../credentials/supabaseClient";
import { getCurrentUser } from "./customerApi";
import { sendPushNotification } from "../utils/sendPushNotification";

// type CreateAppointmentInput = {
//   salonId: string;
//   serviceIds: string[]; // list of selected service IDs
//   appointmentDate: string; // 'YYYY-MM-DD'
//   startTime: string; // 'HH:MM:SS'
//   endTime: string; // 'HH:MM:SS'
// };

// export async function createAppointment({
//   salonId,
//   serviceIds,
//   appointmentDate,
//   startTime,
//   endTime,
// }: CreateAppointmentInput) {
//   const { user, error: userError } = await getCurrentUser();
//   if (userError || !user) return { error: userError || "User not authenticated" };

//   // Create main appointment
//   const { data: appointment, error: appointmentError } = await supabase
//     .from("appointments")
//     .insert([
//       {
//         customer_id: user.id,
//         salon_id: salonId,
//         service_id: serviceIds[0], // optionally still save one in appointments table
//         appointment_date: appointmentDate,
//         start_time: startTime,
//         end_time: endTime,
//       },
//     ])
//     .select("*")
//     .single();

//   if (appointmentError) return { error: appointmentError.message };

//   // If multiple services, insert into appointment_services junction table
//   if (serviceIds.length > 0) {
//     const servicesToInsert = serviceIds.map((serviceId) => ({
//       appointment_id: appointment.id,
//       service_id: serviceId,
//     }));

//     const { error: servicesError } = await supabase
//       .from("appointment_services")
//       .insert(servicesToInsert);

//     if (servicesError) return { error: servicesError.message };
//   }

//   return { success: true, appointment };
// }

type CreateAppointmentInput = {
  salonId: string;
  serviceIds: string[]; // list of selected service IDs
  appointmentDate: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:MM:SS'
  endTime: string; // 'HH:MM:SS'
};

export async function createAppointment({
  salonId,
  serviceIds,
  appointmentDate,
  startTime,
  endTime,
}: CreateAppointmentInput) {
  const { user, error: userError } = await getCurrentUser();
  if (userError || !user) return { error: userError || "User not authenticated" };

  // 1. Create the appointment
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert([
      {
        customer_id: user.id,
        salon_id: salonId,
        service_id: serviceIds[0], // optionally still save one in appointments table
        appointment_date: appointmentDate,
        start_time: startTime,
        end_time: endTime,
      },
    ])
    .select("*")
    .single();

  if (appointmentError) return { error: appointmentError.message };

  // 2. Insert multiple services (junction table)
  if (serviceIds.length > 0) {
    const servicesToInsert = serviceIds.map((serviceId) => ({
      appointment_id: appointment.id,
      service_id: serviceId,
    }));

    const { error: servicesError } = await supabase
      .from("appointment_services")
      .insert(servicesToInsert);

    if (servicesError) return { error: servicesError.message };
  }

  // 3. Fetch salon push token
  const { data: salon, error: salonError } = await supabase
    .from("salons")
    .select("expo_push_token, salon_name")
    .eq("id", salonId)
    .single();

  if (salonError) {
    console.error("Failed to fetch salon push token:", salonError.message);
  } else if (salon.expo_push_token) {
    await sendPushNotification(
      salon.expo_push_token,
      "📅 New Appointment Request",
      `You have a new appointment request for ${appointmentDate}.`
    );
  }

  return { success: true, appointment };
}

export async function getActiveSalonAppointments() {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) return { error: authError.message };
  
    const salonId = userData.user.id;
    const now = new Date().toISOString();
    console.log("Salon ID:", salonId);
console.log("Now:", now);
  
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        status,
        expires_at,
        created_at,
        profiles!customer_id ( full_name, phone ),
        appointment_services!appointment_id ( service:services ( id, name, price, duration_minutes ) )
      `)
      .eq("salon_id", salonId)
      .gt("expires_at", now)
      .order("appointment_date", { ascending: true });
  
    if (error) return { error: error.message };
    return { appointments: data };
  }
  
  export async function getConfirmedSalonAppointments() {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      return { error: authError?.message || "User not authenticated" };
    }
  
    const salonId = userData.user.id;
  
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        status,
        expires_at,
        created_at,
        profiles!customer_id ( full_name, phone ),
        appointment_services!appointment_id (
          service:services ( id, name, price, duration_minutes )
        )
      `)
      .eq("salon_id", salonId)
      .in("status", ["confirmed", "completed"])
      .order("appointment_date", { ascending: true });
  
    if (error) {
      return { error: error.message };
    }
  console.log("data",data)
    return { appointments: data };
  }

  export async function updateAppointmentStatus(id: string, status: 'confirmed' | 'cancelled'| 'completed') {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select(); // optional: returns updated data
  
    if (error) {
      console.error("Error updating appointment:", error.message);
      return { error: error.message };
    }
  
    return { data };
  }

