"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldAlert, 
  LogOut, 
  User as UserIcon, 
  Mail, 
  Key, 
  Database, 
  ShieldCheck, 
  Briefcase,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <svg className="animate-spin h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading workspace...
        </div>
      </div>
    );
  }

  // Define role specific colors
  const roleColors = {
    admin: "from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400",
    analyst: "from-violet-500/20 to-indigo-500/10 border-violet-500/30 text-violet-400",
    auditor: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
  };

  const roleLabels = {
    admin: "System Administrator",
    analyst: "Fraud & AML Analyst",
    auditor: "Compliance Auditor",
  };

  const getRoleColor = (role: string) => roleColors[role as keyof typeof roleColors] || roleColors.analyst;
  const getRoleLabel = (role: string) => roleLabels[role as keyof typeof roleLabels] || "Analyst";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-white text-lg">FinShield AI</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Stream connected
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card & Session Specs */}
        <div className="lg:col-span-1 space-y-6">
          {/* Welcome User Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-900/50 border border-white/10 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/15 transition-all duration-500" />
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-lg">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h2 className="font-semibold text-lg text-white">
                  {user.full_name || "Analyst Session"}
                </h2>
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                  <UserIcon className="w-3.5 h-3.5" />
                  @{user.username}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-500" /> Email
                </span>
                <span className="text-neutral-200 font-mono">{user.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-gray-500" /> Authorization Role
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border bg-gradient-to-br text-[10px] font-semibold uppercase tracking-wide ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          </div>

          {/* System Environment Config Info */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Database className="w-4 h-4 text-violet-400" /> Foundation Infrastructure
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-white/5 shrink-0">
                  <Database className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">PostgreSQL Connected</div>
                  <div className="text-[10px] text-neutral-400">Database Engine: psycopg2 (SQLAlchemy)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-white/5 shrink-0">
                  <Key className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">JWT Encryption Active</div>
                  <div className="text-[10px] text-neutral-400">Algorithm: HS256 HMAC-SHA</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-white/5 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Role-Based Access Guard</div>
                  <div className="text-[10px] text-neutral-400">Claims validation enforced on Backend routes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Capabilities Detail */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-2xl bg-neutral-900 border border-white/10 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Platform Foundation Operational</h2>
              <p className="text-sm text-neutral-400">
                You have successfully authenticated using a secure JSON Web Token. The layered backend architecture is active and listening to API calls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  API Layered Structure
                </div>
                <p className="text-xs text-neutral-400">
                  Routes map to `api/` endpoints, which defer business operations to the `services/` layer. Database accesses are mediated by `repositories/` matching `models/`.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                  Client State Management
                </div>
                <p className="text-xs text-neutral-400">
                  Queries are powered by TanStack React Query, ensuring zero redundant networking and instant state updates on caching models.
                </p>
              </div>
            </div>

            {/* Role authorization scope details */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <h3 className="font-semibold text-xs text-neutral-300 uppercase tracking-wider">Your Authorization Scope</h3>
              
              {user.role === "admin" && (
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-200 text-xs flex gap-3 items-start">
                  <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white mb-1">Administrative Privileges Active</span>
                    As an Administrator, you have read-write credentials to edit security policies, inspect access audit logs, adjust rate limits, and provision/revoke platform analyst credentials.
                  </div>
                </div>
              )}

              {user.role === "analyst" && (
                <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20 text-violet-200 text-xs flex gap-3 items-start">
                  <ShieldCheck className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white mb-1">Fraud Detection Scope Activated</span>
                    As an AML / Fraud Analyst, you are authorized to inspect real-time transaction scoring queues, override automatic flags (whitelist/blacklist), and audit machine learning feature attributions.
                  </div>
                </div>
              )}

              {user.role === "auditor" && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-200 text-xs flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white mb-1">Audit Mode Activated</span>
                    As an Auditor, you possess read-only compliance clearances to generate transaction summaries, audit previous case decisions, and export platform security validation telemetry.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
