"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Incorrect email or password." };
    } else if (error.message.includes("Email not confirmed")) {
      return { error: "Email not confirmed, please confirm in Gmail." };
    } else {
      return { error: "An error occurred. Please try again." };
    }
  }

  return { success: true };
}
