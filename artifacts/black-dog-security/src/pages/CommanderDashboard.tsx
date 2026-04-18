import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  useListCommanderRequests,
  useCommanderLogout,
} from "@workspace/api-client-react";
import { useCommanderAuth } from "@/hooks/useCommanderAuth";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  reviewing: "text-blue-400 border-blue-400/30 bg-blue-400/5",
  approved: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  rejected: "text-red-400 border-red-400/30 bg-red-400/5",
  dispatched: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  closed: "text-white/30 border-white/10 bg-white/[0.02]",
};

export default function CommanderDashboard() {
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const { clearToken } = useCommanderAuth();
  const [, navigate] = useLocation();

  const { data: requests = [], isLoading, refetch } = useListCommanderRequests(
    { status: filterStatus || undefined, q: search || undefined },
    { query: { refetchInterval: 15000 } }
  );

  const logoutMutation = useCommanderLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      clearToken();
      navigate("/commander/login");
    }
  };

  const statuses = ["", "pending", "reviewing", "approved", "rejected", "dispatched", "closed"];

  const counts = requests.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-[hsl(220,16%,4%)] text-white">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(350,46%,46%)] animate-pulse" />
            <span className="font-mono text-xs text-[hsl(350,46%,46%)] tracking-[0.2em] uppercase">
              Commander Center
            </span>
          </div>
          <span className="text-white/20 text-xs font-mono">|</span>
          <span className="font-mono text-xs text-white/40">BLACK DOG SECURITY</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => refetch()}
            className="font-mono text-xs text-white/40 hover:text-white/70 uppercase tracking-widest transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="font-mono text-xs text-[hsl(350,46%,46%)] hover:text-[hsl(350,46%,60%)] uppercase tracking-widest transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-wide text-white">
            Request Queue
          </h1>
          <p className="text-sm text-white/40 font-mono mt-1">
            {requests.length} total — auto-refreshes every 15s
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {["pending", "reviewing", "approved", "rejected", "dispatched", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
              className={`border rounded-sm px-3 py-2 text-center transition-all ${
                filterStatus === s
                  ? STATUS_COLORS[s]
                  : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
              }`}
            >
              <div className="font-mono text-xs uppercase tracking-wider">{s}</div>
              <div className="font-mono text-lg font-bold mt-0.5">{counts[s] ?? 0}</div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, org, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-white/[0.04] border border-white/10 rounded-sm px-4 py-2.5 text-sm font-mono text-white placeholder:text-white/30 outline-none focus:border-[hsl(350,46%,46%)]/50 transition-colors"
          />
        </div>

        {isLoading ? (
          <div className="font-mono text-xs text-white/30 uppercase tracking-widest py-12 text-center">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="font-mono text-xs text-white/20 uppercase tracking-widest py-12 text-center border border-white/5 rounded-sm">
            No requests found
          </div>
        ) : (
          <div className="space-y-2">
            {[...requests].reverse().map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/commander/requests/${req.id}`)}
                className="border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] rounded-sm px-5 py-4 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-sm text-white truncate">
                        {req.subject}
                      </span>
                      <span
                        className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded-sm ${
                          STATUS_COLORS[req.status] ?? "text-white/40 border-white/10"
                        }`}
                      >
                        {req.status}
                      </span>
                      {req.packetSent && (
                        <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-wider text-purple-400 border border-purple-400/30 bg-purple-400/5 px-2 py-0.5 rounded-sm">
                          Packet Sent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                      <span>{req.name}</span>
                      <span className="text-white/20">·</span>
                      <span>{req.organization}</span>
                      <span className="text-white/20">·</span>
                      <span>{req.requestType}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-mono text-xs text-white/30">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="font-mono text-xs text-white/20 mt-0.5">
                      {new Date(req.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
