import { supabase } from "../credentials/supabaseClient";
import { ThemeMode } from "../store/slices/themeSlice";

// Get user's theme preference from backend
export async function getUserTheme(): Promise<{ theme: ThemeMode; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { theme: 'light', error: authError?.message || "User not authenticated" };
    }

    console.log('Fetching theme for user:', user.id);

    // Check if user is a customer or salon
    const { data: customerProfile, error: customerError } = await supabase
      .from("profiles")
      .select("theme")
      .eq("id", user.id)
      .single();

    if (!customerError && customerProfile) {
      console.log('Found customer profile with theme:', customerProfile.theme);
      return { theme: customerProfile.theme || 'light' };
    }

    // If not found in profiles, check salons table
    const { data: salonProfile, error: salonError } = await supabase
      .from("salons")
      .select("theme")
      .eq("id", user.id)
      .single();

    if (!salonError && salonProfile) {
      console.log('Found salon profile with theme:', salonProfile.theme);
      return { theme: salonProfile.theme || 'light' };
    }

    console.log('No profile found, using default light theme');
    // Default to light theme if no preference found
    return { theme: 'light' };
  } catch (error) {
    console.error("Error fetching user theme:", error);
    return { theme: 'light', error: "Failed to fetch theme preference" };
  }
}

// Update user's theme preference in backend
export async function updateUserTheme(theme: ThemeMode): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error in updateUserTheme:', authError);
      return { success: false, error: authError?.message || "User not authenticated" };
    }

    console.log('Updating theme to:', theme, 'for user:', user.id);

    // First, check which table the user exists in
    const { data: customerProfile, error: customerCheckError } = await supabase
      .from("profiles")
      .select("id, theme")
      .eq("id", user.id)
      .single();

    if (!customerCheckError && customerProfile) {
      console.log('User found in profiles table, current theme:', customerProfile.theme);
      // User exists in profiles table
      const { data: updateData, error: updateError } = await supabase
        .from("profiles")
        .update({ theme })
        .eq("id", user.id)
        .select();

      if (updateError) {
        console.error('Error updating customer theme:', updateError);
        return { success: false, error: updateError.message };
      }

      console.log('Successfully updated customer theme to:', theme, 'Update result:', updateData);
      return { success: true };
    }

    // Check if user exists in salons table
    const { data: salonProfile, error: salonCheckError } = await supabase
      .from("salons")
      .select("id, theme")
      .eq("id", user.id)
      .single();

    if (!salonCheckError && salonProfile) {
      console.log('User found in salons table, current theme:', salonProfile.theme);
      // User exists in salons table
      const { data: updateData, error: updateError } = await supabase
        .from("salons")
        .update({ theme })
        .eq("id", user.id)
        .select();

      if (updateError) {
        console.error('Error updating salon theme:', updateError);
        return { success: false, error: updateError.message };
      }

      console.log('Successfully updated salon theme to:', theme, 'Update result:', updateData);
      return { success: true };
    }

    console.error('User not found in either profiles or salons table');
    return { success: false, error: "User profile not found" };
  } catch (error) {
    console.error("Error updating user theme:", error);
    return { success: false, error: "Failed to update theme preference" };
  }
} 