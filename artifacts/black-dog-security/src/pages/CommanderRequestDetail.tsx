import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  useGetCommanderRequest,
  useUpdateRequestStatus,
  useUpdateRequestNotes,
  useDispatchPacket,
} from "@workspace/api-client-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  reviewing: "text-blue-400 border-blue-400/30 bg-blue-400/5",
  approved: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  rejected: "text-red-400 border-red-400/30 bg-red-400/5",
  dispatched: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  closed: "text-white/30 border-white/10 bg-white/[0.02]",
};

const STATUSES = ["pending", "reviewing", "approved", "rejected", "dispatched", "closed"];

export default function CommanderRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [notes, setNotes] = useState("");
  const [notesEditing, setNotesEditing] = useState(false);
  const [statusNote, setStatusNote] = useState("");

  const {
    data: request,
    isLoading,
    refetch,
  } = useGetCommanderRequest(id!, {
    query: { enabled: !!id },
  });

  useEffect(() => {
    if (request) {
      setNotes(request.internalNotes ?? "");
    }
  }, [request?.id]);

  const updateStatus = useUpdateRequestStatus();
  const updateNotes = useUpdateRequestNotes();
  const dispatch = useDispatchPacket();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(220,16%,4%)] flex items-center justify-center">
        <span className="font-mono text-xs text-white/30 uppercase tracking-widest">
          Loading...
        </span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-[hsl(220,16%,4%)] flex items-center justify-center">
        <span className="font-mono text-xs text-[hsl(350,46%,46%)] uppercase tracking-widest">
          Request not found
        </span>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    await updateStatus.mutateAsync({
      id: id!,
      data: { status: newStatus, note: statusNote || undefined },
    });
    setStatusNote("");
    refetch();
  };

  const handleSaveNotes = async () => {
    await updateNotes.mutateAsync({ id: id!, data: { internalNotes: notes } });
    setNotesEditing(false);
    refetch();
  };

  const handleDispatch = async () => {
    await dispatch.mutateAsync({ id: id! });
    refetch();
  };

  return (
    <div className="min-h-screen bg-[hsl(220,16%,4%)] text-white">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/commander")}
            className="font-mono text-xs text-white/40 hover:text-white/70 uppercase tracking-widest transition-colors"
          >
            &larr; Back
          </button>
          <span className="text-white/20 text-xs font-mono">|</span>
          <span className="font-mono text-xs text-[hsl(350,46%,46%)] tracking-[0.2em] uppercase">
            Request Detail
          </span>
        </div>
        <span className="font-mono text-xs text-white/20 truncate max-w-xs">{id}</span>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-white/5 bg-white/[0.02] rounded-sm p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-lg font-semibold text-white leading-tight mb-1">
                    {request.subject}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded-sm ${
                        STATUS_COLORS[request.status] ?? "text-white/40 border-white/10"
                      }`}
                    >
                      {request.status}
                    </span>
                    {request.packetSent && (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-purple-400 border border-purple-400/30 bg-purple-400/5 px-2 py-0.5 rounded-sm">
                        Packet Dispatched
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5 border-t border-white/5 pt-4">
                {[
                  ["Name", request.name],
                  ["Organization", request.organization],
                  ["Email", request.email],
                  ["Request Type", request.requestType],
                  ["Linked System", request.linkedSystem],
                  [
                    "Submitted",
                    new Date(request.createdAt).toLocaleString("en-US"),
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-0.5">
                      {label}
                    </div>
                    <div className="text-sm text-white/80">{value}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-2">
                  Message
                </div>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                  {request.message}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-white/5 bg-white/[0.02] rounded-sm p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                  Internal Notes
                </div>
                {!notesEditing ? (
                  <button
                    onClick={() => { setNotes(request.internalNotes ?? ""); setNotesEditing(true); }}
                    className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setNotesEditing(false)}
                      className="font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      disabled={updateNotes.isPending}
                      className="font-mono text-[10px] uppercase tracking-widest text-[hsl(350,46%,46%)] hover:text-[hsl(350,46%,60%)] transition-colors"
                    >
                      {updateNotes.isPending ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>
              {notesEditing ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-sm px-3 py-2.5 text-sm font-mono text-white placeholder:text-white/20 outline-none focus:border-[hsl(350,46%,46%)]/50 transition-colors resize-none"
                  placeholder="Internal notes visible only to Commander..."
                />
              ) : (
                <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap font-mono">
                  {request.internalNotes || "No internal notes."}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-white/5 bg-white/[0.02] rounded-sm p-6"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">
                Action History
              </div>
              {request.history.length === 0 ? (
                <p className="text-xs font-mono text-white/20">No actions recorded.</p>
              ) : (
                <div className="space-y-2">
                  {[...request.history].reverse().map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-4 text-xs font-mono"
                    >
                      <span className="text-white/25 flex-shrink-0 w-36">
                        {new Date(entry.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-[hsl(350,46%,60%)] flex-shrink-0 uppercase tracking-wide">
                        {entry.action}
                      </span>
                      {entry.note && (
                        <span className="text-white/40">{entry.note}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="border border-white/5 bg-white/[0.02] rounded-sm p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">
                Update Status
              </div>
              <div className="space-y-2 mb-3">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={s === request.status || updateStatus.isPending}
                    className={`w-full text-left border rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-wider transition-all disabled:cursor-not-allowed ${
                      s === request.status
                        ? STATUS_COLORS[s]
                        : "border-white/10 text-white/30 hover:border-white/25 hover:text-white/60"
                    }`}
                  >
                    {s === request.status ? `— ${s}` : s}
                  </button>
                ))}
              </div>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={2}
                placeholder="Optional note for this status change..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-sm px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 outline-none focus:border-[hsl(350,46%,46%)]/40 transition-colors resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="border border-[hsl(350,46%,46%)]/20 bg-[hsl(350,46%,46%)]/[0.03] rounded-sm p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-[hsl(350,46%,46%)]/60 mb-2">
                Dispatch Packet
              </div>
              <p className="text-xs text-white/40 font-mono mb-4 leading-relaxed">
                Mark information packet as dispatched to{" "}
                <span className="text-white/60">{request.email}</span>. This
                will set status to "dispatched" and log the action.
              </p>
              <button
                onClick={handleDispatch}
                disabled={request.packetSent || dispatch.isPending}
                className="w-full bg-[hsl(350,46%,46%)] hover:bg-[hsl(350,46%,52%)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-xs uppercase tracking-widest py-2.5 rounded-sm transition-colors"
              >
                {request.packetSent
                  ? "Packet Already Sent"
                  : dispatch.isPending
                  ? "Dispatching..."
                  : "Dispatch Packet"}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
