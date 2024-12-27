"use server";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const { user, error } = await supabase.auth.signUp(data);

    if (error) {
      if (error.message.includes("Email already exists")) {
        return {
          error: "Email is already registered. Please use a different one.",
        };
      } else if (error.message.includes("Password")) {
        return { error: "Password must be at least 6 characters long." };
      } else if (error.message.includes("Invalid email")) {
        return {
          error: "Invalid email. Please ensure the email format is correct.",
        };
      } else {
        return { error: "An error occurred. Please try again." };
      }
    }

    return { success: true };
  } catch (err) {
    return { error: "An unexpected error occurred. Please try again." };
  }
}
