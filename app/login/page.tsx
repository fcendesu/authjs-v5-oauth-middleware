"use client";
import { signIn } from "next-auth/react";

function SignIn() {
  return (
    <button onClick={() => signIn("google", { redirectTo: "/dashboard" })}>
      Sign In Google
    </button>
  );
}

export default SignIn;
