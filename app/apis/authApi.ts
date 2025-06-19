import { supabase } from "../credentials/supabaseClient";

type CustomerSignUpInput = {
  email: string;
  password: string;
  name: string;
  phone: string;
  gender: string;
};

type SalonSignUpInput = {
  email: string;
  password: string;
  salon_name: string;
  address: string;
  city: string;
};

// 🧑 Customer Sign Up
export async function signUpCustomer(input: CustomerSignUpInput) {
  const { email, password, name, phone, gender } = input;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) return { error: signUpError.message };
  const user = signUpData.user;
  if (!user) return { error: 'No user returned' };

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    full_name: name,
    phone,
    email,
    gender,
    theme: 'light', // Default theme
  });

  if (insertError) return { error: insertError.message };

  return { success: true };
}

// 💈 Salon Sign Up
export async function signUpSalon(input: SalonSignUpInput) {
  const { email, password, salon_name, address, city } = input;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) return { error: signUpError.message };
  const user = signUpData.user;
  if (!user) return { error: 'No user returned' };

  const { error: insertError } = await supabase.from("salons").insert({
    id: user.id,
    salon_name,
    address,
    city,
    email,
    open_time: "09:00",
    close_time: "18:00",
    ambience_images: [],
    description: "",
    theme: 'light', // Default theme
  });

  if (insertError) return { error: insertError.message };

  return { success: true };
}

// 🔐 Login
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return {
    success: true,
    session: data.session,
    user: data.user,
  };
}

// 👤 Get Current User
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return { error: error.message };
  return { user };
}

// 🚪 Logout
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  return { success: true };
}
