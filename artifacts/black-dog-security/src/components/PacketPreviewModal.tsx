import { motion, AnimatePresence } from "framer-motion";

interface PacketPreviewModalProps {
  open: boolean;
  onClose: () => void;
  request: {
    displayId: string;
    name: string;
    organization: string;
    email: string;
    requestType: string;
  };
}

export default function PacketPreviewModal({ open, onClose, request }: PacketPreviewModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[hsl(350,46%,46%)]/30 bg-[hsl(220,16%,5%)] rounded-sm"
          >
            <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] text-[hsl(350,46%,46%)] uppercase tracking-[0.2em] mb-1">
                  Controlled Distribution — Information Packet
                </div>
                <div className="font-mono text-xs text-white/40">
                  Recipient: {request.name} · {request.organization}
                </div>
              </div>
              <button
                onClick={onClose}
                className="font-mono text-xs text-white/30 hover:text-white/70 uppercase tracking-widest transition-colors ml-6"
              >
                Close
              </button>
            </div>

            <div className="px-6 py-6 space-y-6 font-mono text-sm">
              <div className="border border-[hsl(350,46%,46%)]/20 bg-[hsl(350,46%,46%)]/[0.04] rounded-sm px-4 py-3">
                <div className="text-[10px] text-[hsl(350,46%,46%)] uppercase tracking-widest mb-1">
                  Classification
                </div>
                <div className="text-white/70 text-xs">
                  CONTROLLED — RSR INTELLIGENCE NETWORK — INTERNAL DISTRIBUTION ONLY
                </div>
              </div>

              <section>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">
                  01 / Overview
                </div>
                <p className="text-white/70 leading-relaxed text-xs">
                  BLACK DOG SECURITY is the protective security division of the RSR Intelligence
                  Network. Established to provide comprehensive threat-aware protection for
                  personnel, assets, information, and operational environments across all RSR
                  domains. BLACK DOG operates under strict operational security protocols and
                  maintains 24/7 readiness posture.
                </p>
              </section>

              <section>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">
                  02 / Mission
                </div>
                <p className="text-white/70 leading-relaxed text-xs">
                  To protect the RSR Intelligence Network and its affiliated personnel through
                  intelligence-led security operations, proactive threat assessment, and
                  coordinated response. BLACK DOG serves as the first and last line of defense
                  for the Network's most sensitive environments and assets.
                </p>
              </section>

              <section>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">
                  03 / Core Capabilities
                </div>
                <div className="space-y-2">
                  {[
                    ["Protective Operations", "Close protection, venue security, personnel escort, and secure transit for RSR principals and high-value assets."],
                    ["Exposure Monitoring", "Continuous assessment of digital and physical exposure vectors, surface-level vulnerability scanning, and unauthorized information presence."],
                    ["Information Protection", "Classification management, secure communication enforcement, and insider threat mitigation across all RSR platforms."],
                    ["Threat Intelligence", "Real-time assessment of emerging threats, adversary profiling, and preemptive risk reduction across operational areas."],
                    ["Incident Response", "Rapid internal notification, escalation, and coordinated response to threat indicators, breaches, or operational disruptions."],
                    ["System Hardening", "Security architecture review, access control enforcement, and configuration hardening across RSR technical infrastructure."],
                  ].map(([title, desc]) => (
                    <div key={title} className="border border-white/5 rounded-sm px-3 py-2">
                      <div className="text-[10px] text-[hsl(350,46%,46%)] uppercase tracking-wider mb-0.5">{title}</div>
                      <div className="text-white/50 text-xs leading-relaxed">{desc}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">
                  04 / Role in the RSR Ecosystem
                </div>
                <p className="text-white/70 leading-relaxed text-xs">
                  BLACK DOG operates as an integrated division within the RSR Intelligence Network,
                  coordinating directly with RSR Analytics, RSR Operations, and RSR Communications.
                  Security assessments and threat intelligence produced by BLACK DOG inform
                  decisions across all Network divisions. Protective details coordinate with RSR
                  transport and logistics. All BLACK DOG operations are classified and subject to
                  Network-level oversight.
                </p>
              </section>

              <section>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">
                  05 / Engagement Process — Next Steps
                </div>
                <div className="space-y-2 text-xs text-white/60 leading-relaxed">
                  <p>
                    Your request ({request.displayId}) has been logged and reviewed by the BLACK
                    DOG Commander team. The following steps apply to all engagement inquiries:
                  </p>
                  <ol className="space-y-1 pl-4">
                    <li>1. Initial review completed — status updated in the RSR request system</li>
                    <li>2. Supplemental verification may be requested prior to full engagement</li>
                    <li>3. A BLACK DOG liaison will initiate secure contact via the provided channel</li>
                    <li>4. All communications are subject to RSR Intelligence Network security protocols</li>
                    <li>5. No information from this packet may be shared or reproduced without written authorization</li>
                  </ol>
                </div>
              </section>

              <div className="border-t border-white/5 pt-4 text-[10px] text-white/25 leading-relaxed">
                This document is intended exclusively for {request.name} ({request.email}) in
                connection with request {request.displayId}. Unauthorized distribution, reproduction,
                or disclosure is strictly prohibited under RSR Intelligence Network security
                directives. Classification: CONTROLLED — {new Date().getFullYear()} RSR Intelligence Network.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
