import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  useListCommanderRequests,
  useCommanderLogout,
} from "@workspace/api-client-react";
import { useCommanderAuth } from "@/hooks/useCommanderAuth";

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "text-amber-400 border-amber-400/30 bg-amber-400/5" },
  approved: { label: "Approved", cls: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5" },
  more_info: { label: "More Info Req.", cls: "text-blue-400 border-blue-400/30 bg-blue-400/5" },
  denied: { label: "Denied", cls: "text-red-400 border-red-400/30 bg-red-400/5" },
  dispatched: { label: "Dispatched", cls: "text-purple-400 border-purple-400/30 bg-purple-400/5" },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, cls: "text-white/40 border-white/10 bg-white/[0.02]" };
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded-sm ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

export default function CommanderDashboard() {
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const { clearToken } = useCommanderAuth();
  const [, navigate] = useLocation();

  const { data: requests = [], isLoading, refetch } = useListCommanderRequests(
    { status: filterStatus || undefined, q: search || undefined }
  );

  useEffect(() => {
    const timer = setInterval(() => { void refetch(); }, 15000);
    return () => clearInterval(timer);
  }, [refetch]);

  const logoutMutation = useCommanderLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      clearToken();
      navigate("/commander/login");
    }
  };

  const counts = requests.reduce(
    (acc, r) => { acc[r.status] = (acc[r.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );
  const totalPending = counts["pending"] ?? 0;

  const filterButtons = [
    { key: "", label: "All", count: requests.length },
    { key: "pending", label: "Pending", count: counts["pending"] ?? 0 },
    { key: "approved", label: "Approved", count: counts["approved"] ?? 0 },
    { key: "more_info", label: "More Info", count: counts["more_info"] ?? 0 },
    { key: "denied", label: "Denied", count: counts["denied"] ?? 0 },
    { key: "dispatched", label: "Dispatched", count: counts["dispatched"] ?? 0 },
  ];

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
          {totalPending > 0 && (
            <span className="font-mono text-[10px] text-amber-400 border border-amber-400/30 bg-amber-400/5 px-2 py-0.5 rounded-sm uppercase tracking-wider">
              {totalPending} Pending
            </span>
          )}
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
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold tracking-wide text-white">
              Request Queue
            </h1>
            <p className="text-sm text-white/40 font-mono mt-0.5">
              {requests.length} total · auto-refreshes every 15s
            </p>
          </div>
          <input
            type="text"
            placeholder="Search by name, org, ID, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs bg-white/[0.04] border border-white/10 rounded-sm px-3 py-2 text-xs font-mono text-white placeholder:text-white/25 outline-none focus:border-[hsl(350,46%,46%)]/50 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {filterButtons.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "" : key)}
              className={`border rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                filterStatus === key
                  ? key === "" ? "border-white/30 text-white bg-white/[0.06]"
                    : (STATUS_META[key]?.cls ?? "border-white/30 text-white")
                  : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/60"
              }`}
            >
              {label} <span className="text-white/40 ml-1">{count}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="font-mono text-xs text-white/30 uppercase tracking-widest py-16 text-center">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="font-mono text-xs text-white/20 uppercase tracking-widest py-16 text-center border border-white/5 rounded-sm">
            No requests found
          </div>
        ) : (
          <div className="space-y-1.5">
            {[...requests].reverse().map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025 }}
                onClick={() => navigate(`/commander/requests/${req.id}`)}
                className="border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] rounded-sm px-5 py-4 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-mono text-[10px] text-white/30 tracking-wider flex-shrink-0">
                        {req.displayId || req.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="font-semibold text-sm text-white truncate">
                        {req.subject}
                      </span>
                      <StatusBadge status={req.status} />
                      {req.packetSent && (
                        <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-wider text-purple-400 border border-purple-400/30 bg-purple-400/5 px-2 py-0.5 rounded-sm">
                          Packet Sent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/35 font-mono flex-wrap">
                      <span>{req.name}</span>
                      <span className="text-white/15">·</span>
                      <span>{req.organization}</span>
                      <span className="text-white/15">·</span>
                      <span className="capitalize">{req.requestType}</span>
                      {req.linkedSystem && req.linkedSystem !== "General" && (
                        <>
                          <span className="text-white/15">·</span>
                          <span>{req.linkedSystem}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-mono text-xs text-white/25">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>
                    <div className="font-mono text-xs text-white/15 mt-0.5">
                      {new Date(req.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit", minute: "2-digit",
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
