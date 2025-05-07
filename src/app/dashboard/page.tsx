"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import TodoList from "@/components/firestore/TodoList";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p className="mb-4">Welcome, {user.email}!</p>
        <p className="mb-6">
          You are now signed in with Firebase Authentication.
        </p>

        <TodoList />

        <div className="mt-8">
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
