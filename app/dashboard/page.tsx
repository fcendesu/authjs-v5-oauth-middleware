"use client";
import { signOut } from "next-auth/react";

function Dashboard() {
  return <button onClick={() => signOut({ redirectTo: "/" })}>Sign Out</button>;
}

export default Dashboard;
