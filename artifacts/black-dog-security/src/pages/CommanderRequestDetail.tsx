import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  useGetCommanderRequest,
  useUpdateRequestStatus,
  useUpdateRequestNotes,
  useDispatchPacket,
} from "@workspace/api-client-react";
import PacketPreviewModal from "@/components/PacketPreviewModal";

const STATUS_META: Record<string, { label: string; cls: string; action: string }> = {
  pending: { label: "Pending", cls: "text-amber-400 border-amber-400/30 bg-amber-400/5", action: "Mark Pending" },
  approved: { label: "Approved", cls: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5", action: "Approve" },
  more_info: { label: "More Info Requested", cls: "text-blue-400 border-blue-400/30 bg-blue-400/5", action: "Request More Info" },
  denied: { label: "Denied", cls: "text-red-400 border-red-400/30 bg-red-400/5", action: "Deny" },
  dispatched: { label: "Dispatched", cls: "text-purple-400 border-purple-400/30 bg-purple-400/5", action: "Mark Dispatched" },
};

const RESPONSE_TEMPLATES: Record<string, string> = {
  approved: `Your request has been reviewed and approved by the BLACK DOG Commander team.

A liaison will initiate secure contact via your provided channel within 48–72 hours. Please ensure your contact information remains current in our system.

All subsequent communications are governed by RSR Intelligence Network security protocols. Do not share this correspondence.`,

  more_info: `Your request has been received and is under active review. Before we can proceed, we require additional information to complete our assessment.

Please provide:
— Supplemental identification or organizational verification
— Additional context regarding the nature and urgency of your request
— Preferred secure contact method

Respond via the same secure channel used for initial submission. Your request ID must be referenced in all follow-up communications.`,

  denied: `After careful review, the BLACK DOG Commander team has determined that your request does not meet the current criteria for engagement.

This determination is final. If you believe this decision was made in error or if circumstances have materially changed, you may submit a new request with updated supporting information after 90 days.

This communication is confidential. Do not share or reproduce this decision.`,

  dispatched: `Your BLACK DOG Security information packet has been formally dispatched. All materials are classified under RSR Intelligence Network access protocols.

Review the enclosed materials carefully. Next steps and liaison contact procedures are outlined within the packet.

This packet is for your exclusive use. Unauthorized distribution is prohibited.`,
};

const STATUSES = ["pending", "approved", "more_info", "denied", "dispatched"] as const;

export default function CommanderRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [notes, setNotes] = useState("");
  const [notesEditing, setNotesEditing] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [showPacketPreview, setShowPacketPreview] = useState(false);
  const [templateKey, setTemplateKey] = useState<keyof typeof RESPONSE_TEMPLATES | "">("");

  const { data: request, isLoading, refetch } = useGetCommanderRequest(id!, {
    query: { enabled: !!id },
  });

  useEffect(() => {
    if (request) setNotes(request.internalNotes ?? "");
  }, [request?.id]);

  const updateStatus = useUpdateRequestStatus();
  const updateNotes = useUpdateRequestNotes();
  const dispatch = useDispatchPacket();

  const handleStatusChange = async (newStatus: string) => {
    const note = statusNote.trim() || (templateKey && RESPONSE_TEMPLATES[templateKey] ? `Template: ${templateKey}` : undefined);
    await updateStatus.mutateAsync({ id: id!, data: { status: newStatus, note } });
    setStatusNote("");
    setTemplateKey("");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(220,16%,4%)] flex items-center justify-center">
        <span className="font-mono text-xs text-white/30 uppercase tracking-widest animate-pulse">
          Loading request...
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

  const currentMeta = STATUS_META[request.status] ?? { label: request.status, cls: "text-white/40 border-white/10 bg-white/[0.02]", action: request.status };

  return (
    <>
      {showPacketPreview && (
        <PacketPreviewModal
          open={showPacketPreview}
          onClose={() => setShowPacketPreview(false)}
          request={{
            displayId: request.displayId,
            name: request.name,
            organization: request.organization,
            email: request.email,
            requestType: request.requestType,
          }}
        />
      )}

      <div className="min-h-screen bg-[hsl(220,16%,4%)] text-white">
        <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/commander")}
              className="font-mono text-xs text-white/40 hover:text-white/70 uppercase tracking-widest transition-colors"
            >
              &larr; Queue
            </button>
            <span className="text-white/15 text-xs font-mono">|</span>
            <span className="font-mono text-xs text-[hsl(350,46%,46%)] tracking-[0.2em] uppercase">
              Request Detail
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded-sm ${currentMeta.cls}`}>
              {currentMeta.label}
            </span>
            <span className="font-mono text-xs text-white/25">{request.displayId}</span>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN — submission info, notes, history */}
            <div className="lg:col-span-2 space-y-5">

              {/* Submission info */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="border border-white/5 bg-white/[0.02] rounded-sm p-6">
                <h2 className="font-semibold text-base text-white mb-4 leading-tight">
                  {request.subject}
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-5">
                  {[
                    ["Request ID", request.displayId],
                    ["Submitted", new Date(request.createdAt).toLocaleString("en-US")],
                    ["Name / Callsign", request.name],
                    ["Organization", request.organization],
                    ["Contact", request.email],
                    ["Request Type", request.requestType],
                    ["Linked System", request.linkedSystem],
                    ["Last Updated", new Date(request.updatedAt).toLocaleString("en-US")],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-white/25 mb-0.5">{label}</div>
                      <div className="text-sm text-white/75">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/25 mb-2">Message</div>
                  <p className="text-sm text-white/65 leading-relaxed whitespace-pre-wrap">{request.message}</p>
                </div>
              </motion.div>

              {/* Internal notes */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="border border-white/5 bg-white/[0.02] rounded-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/25">Internal Notes</div>
                  {!notesEditing ? (
                    <button
                      onClick={() => { setNotes(request.internalNotes ?? ""); setNotesEditing(true); }}
                      className="font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white/65 transition-colors"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button onClick={() => setNotesEditing(false)}
                        className="font-mono text-[10px] uppercase tracking-widest text-white/25 hover:text-white/55 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSaveNotes} disabled={updateNotes.isPending}
                        className="font-mono text-[10px] uppercase tracking-widest text-[hsl(350,46%,46%)] hover:text-[hsl(350,46%,60%)] transition-colors">
                        {updateNotes.isPending ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>
                {notesEditing ? (
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-sm px-3 py-2.5 text-xs font-mono text-white placeholder:text-white/20 outline-none focus:border-[hsl(350,46%,46%)]/50 transition-colors resize-none"
                    placeholder="Internal notes (Commander only)..." />
                ) : (
                  <p className="text-xs text-white/45 leading-relaxed whitespace-pre-wrap font-mono">
                    {request.internalNotes || "No internal notes."}
                  </p>
                )}
              </motion.div>

              {/* Action history */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                className="border border-white/5 bg-white/[0.02] rounded-sm p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/25 mb-3">
                  Audit Trail
                </div>
                {request.history.length === 0 ? (
                  <p className="text-xs font-mono text-white/20">No actions recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {[...request.history].reverse().map((entry) => (
                      <div key={entry.id} className="flex items-start gap-4 text-xs font-mono border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
                        <span className="text-white/20 flex-shrink-0 w-32 tabular-nums">
                          {new Date(entry.timestamp).toLocaleString("en-US", {
                            month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                        <span className="text-[hsl(350,46%,56%)] flex-shrink-0 uppercase tracking-wide min-w-[12rem]">
                          {entry.action.replace(/_/g, " ").replace("status changed:", "→ ")}
                        </span>
                        {entry.note && (
                          <span className="text-white/35 leading-relaxed">{entry.note}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* RIGHT COLUMN — actions */}
            <div className="space-y-4">

              {/* Status actions */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="border border-white/5 bg-white/[0.02] rounded-sm p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/25 mb-3">Review Actions</div>
                <div className="space-y-1.5 mb-4">
                  {STATUSES.map((s) => {
                    const meta = STATUS_META[s];
                    const isCurrent = s === request.status;
                    return (
                      <button key={s} onClick={() => !isCurrent && handleStatusChange(s)}
                        disabled={isCurrent || updateStatus.isPending}
                        className={`w-full text-left border rounded-sm px-3 py-2.5 font-mono text-xs transition-all ${
                          isCurrent
                            ? `${meta.cls} cursor-default`
                            : "border-white/10 text-white/30 hover:border-white/25 hover:text-white/65 cursor-pointer"
                        }`}>
                        {isCurrent ? `\u2022 ${meta.label} (current)` : meta.action}
                      </button>
                    );
                  })}
                </div>

                {/* Response templates */}
                <div className="border-t border-white/5 pt-3 mb-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/20 mb-2">Response Template</div>
                  <select
                    value={templateKey}
                    onChange={(e) => {
                      const k = e.target.value as keyof typeof RESPONSE_TEMPLATES | "";
                      setTemplateKey(k);
                      if (k && RESPONSE_TEMPLATES[k]) setStatusNote(RESPONSE_TEMPLATES[k]);
                    }}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-sm px-3 py-2 text-xs font-mono text-white/50 outline-none focus:border-[hsl(350,46%,46%)]/40 transition-colors"
                  >
                    <option value="">— Select template —</option>
                    <option value="approved">Approval</option>
                    <option value="more_info">Request More Info</option>
                    <option value="denied">Denial</option>
                    <option value="dispatched">Packet Dispatched</option>
                  </select>
                </div>

                <textarea value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows={4}
                  placeholder="Action note or response message..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-sm px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 outline-none focus:border-[hsl(350,46%,46%)]/40 transition-colors resize-none"
                />
              </motion.div>

              {/* Packet system */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="border border-[hsl(350,46%,46%)]/20 bg-[hsl(350,46%,46%)]/[0.03] rounded-sm p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[hsl(350,46%,46%)]/60 mb-2">
                  Information Packet
                </div>
                <p className="text-xs text-white/35 font-mono mb-4 leading-relaxed">
                  Dispatch the BLACK DOG information packet to{" "}
                  <span className="text-white/55">{request.email}</span>.
                  {request.packetSent && request.packetSentAt && (
                    <span className="block mt-1 text-purple-400/70">
                      Sent {new Date(request.packetSentAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  )}
                </p>
                <button
                  onClick={() => setShowPacketPreview(true)}
                  className="w-full border border-white/15 hover:border-white/30 text-white/50 hover:text-white/80 font-mono text-[10px] uppercase tracking-widest py-2 rounded-sm transition-colors mb-2"
                >
                  Preview Packet
                </button>
                <button
                  onClick={handleDispatch}
                  disabled={request.packetSent || dispatch.isPending}
                  className="w-full bg-[hsl(350,46%,46%)] hover:bg-[hsl(350,46%,52%)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-[10px] uppercase tracking-widest py-2.5 rounded-sm transition-colors"
                >
                  {request.packetSent ? "Packet Sent" : dispatch.isPending ? "Dispatching..." : "Send Packet"}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
