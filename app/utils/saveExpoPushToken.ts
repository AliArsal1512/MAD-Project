import { supabase } from "../credentials/supabaseClient";

export async function saveExpoPushToken(
    userId: string,
    token: string,
    isSalon: boolean
  ) {
    const table = isSalon ? "salons" : "profiles";
  
    const { error } = await supabase
      .from(table)
      .update({ expo_push_token: token })
      .eq("id", userId);
  
    if (error) {
      console.error("Failed to save Expo push token:", error.message);
    } else {
      console.log("Expo push token saved successfully");
    }
  }
