"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Incorrect email or password." };
    } else {
      return { error: "An error occurred. Please try again." };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}
