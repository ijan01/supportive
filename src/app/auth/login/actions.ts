"use server";

import { signIn } from "../../../../auth";
import { AuthError } from "next-auth";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "Invalid email or password"
            : `Sign-in error: ${error.type}`,
      };
    }
    throw error;
  }
  return null;
}
