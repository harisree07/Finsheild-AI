"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.08),transparent_50%)]" />
      
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-[0_0_30px_rgba(139,92,246,0.3)] mb-2">
          <ShieldAlert className="w-9 h-9 text-white animate-pulse" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          FinShield AI
        </h1>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
          Securing gateway session...
        </div>
      </div>
    </main>
  );
}
