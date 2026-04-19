import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Shield, Eye, Lock, AlertTriangle, Server, Bell,
  Menu, X, ExternalLink, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useSubmitRequest } from '@workspace/api-client-react';

const formSchema = z.object({
  name: z.string().min(2, "Identifier required"),
  organization: z.string().min(2, "Organization required"),
  email: z.string().email("Valid contact address required"),
  subject: z.string().min(4, "Subject required"),
  requestType: z.string().min(1, "Select request classification"),
  message: z.string().min(10, "Minimum 10 characters required")
});

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09 }
  }
};

/* ——— Black Dog Emblem SVG ——— */
function BlackDogEmblem() {
  return (
    <div className="relative mx-auto" style={{ width: 180, height: 180 }}>
      {/* Radial glow behind emblem */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(150,40,60,0.13) 0%, transparent 70%)',
          transform: 'scale(1.4)',
        }}
      />
      <svg
        width="180"
        height="180"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Outer hexagonal shield frame */}
        <path
          d="M120 14 L212 64 L212 176 L120 226 L28 176 L28 64 Z"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="0.8"
          fill="none"
        />
        {/* Inner hexagonal frame (dashed) */}
        <path
          d="M120 30 L198 76 L198 164 L120 210 L42 164 L42 76 Z"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.6"
          strokeDasharray="4 5"
          fill="none"
        />

        {/* Corner accent marks on outer hex */}
        <line x1="120" y1="14" x2="120" y2="24" stroke="rgba(160,50,70,0.5)" strokeWidth="1.2" />
        <line x1="212" y1="64" x2="203" y2="69" stroke="rgba(160,50,70,0.5)" strokeWidth="1.2" />
        <line x1="212" y1="176" x2="203" y2="171" stroke="rgba(160,50,70,0.5)" strokeWidth="1.2" />
        <line x1="120" y1="226" x2="120" y2="216" stroke="rgba(160,50,70,0.5)" strokeWidth="1.2" />
        <line x1="28" y1="176" x2="37" y2="171" stroke="rgba(160,50,70,0.5)" strokeWidth="1.2" />
        <line x1="28" y1="64" x2="37" y2="69" stroke="rgba(160,50,70,0.5)" strokeWidth="1.2" />

        {/* Dog head silhouette — angular front-facing guard dog */}
        {/* Main skull/head block */}
        <path
          d="M 90,58
             L 78,48
             L 74,62
             L 86,74
             L 82,78
             L 80,96
             L 80,126
             L 84,148
             L 92,162
             L 120,166
             L 148,162
             L 156,148
             L 160,126
             L 160,96
             L 158,78
             L 154,74
             L 166,62
             L 162,48
             L 150,58
             L 140,64
             L 120,62
             Z"
          fill="hsl(220,16%,5%)"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="0.8"
        />

        {/* Muzzle / snout area — slightly lighter fill, suggests protrusion */}
        <path
          d="M 98,120 L 142,120 L 146,138 L 140,154 L 120,158 L 100,154 L 94,138 Z"
          fill="hsl(218,14%,8%)"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="0.6"
        />

        {/* Left eye — diamond shape */}
        <path
          d="M 97,95 L 107,103 L 97,111 L 87,103 Z"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.9"
        />
        {/* Left eye pupil */}
        <path
          d="M 97,99 L 101,103 L 97,107 L 93,103 Z"
          fill="rgba(160,50,70,0.55)"
        />

        {/* Right eye — diamond shape */}
        <path
          d="M 143,95 L 153,103 L 143,111 L 133,103 Z"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.9"
        />
        {/* Right eye pupil */}
        <path
          d="M 143,99 L 147,103 L 143,107 L 139,103 Z"
          fill="rgba(160,50,70,0.55)"
        />

        {/* Nose bridge line */}
        <line x1="120" y1="78" x2="120" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />

        {/* Nose — inverted triangle */}
        <path
          d="M 120,144 L 130,133 L 110,133 Z"
          fill="rgba(255,255,255,0.14)"
        />

        {/* Ear inner detail lines — left ear */}
        <path
          d="M 83,72 L 78,58 L 88,68"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.7"
        />
        {/* Ear inner detail lines — right ear */}
        <path
          d="M 157,72 L 162,58 L 152,68"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.7"
        />

        {/* Brow ridge lines — adds seriousness */}
        <path
          d="M 82,92 L 108,88"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        <path
          d="M 158,92 L 132,88"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />

        {/* Neck — two converging lines at bottom of head */}
        <path
          d="M 92,162 L 84,188 L 156,188 L 148,162"
          fill="hsl(220,16%,4%)"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="0.6"
        />

        {/* Center bottom emblem line — crest base */}
        <line x1="84" y1="188" x2="156" y2="188" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" />

        {/* Crimson accent — thin line on top of head */}
        <path
          d="M 99,63 L 141,63"
          stroke="rgba(160,50,70,0.6)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}

/* ——— Capabilities data ——— */
const capabilities = [
  {
    icon: Shield,
    title: "Operational Security",
    desc: "Protecting personnel, assets, and information across all RSR operational environments. Threat-aware posture maintained at all times."
  },
  {
    icon: Eye,
    title: "Exposure Monitoring",
    desc: "Continuous monitoring of digital exposure vectors, surface-level vulnerabilities, and unauthorized information presence. Proactive, not reactive."
  },
  {
    icon: Lock,
    title: "Information Protection",
    desc: "Strict handling protocols for sensitive intelligence and classified operational material. Zero-tolerance for unauthorized disclosure."
  },
  {
    icon: AlertTriangle,
    title: "Threat Awareness",
    desc: "Ongoing assessment of threat landscapes relevant to RSR personnel and network assets. Actionable intelligence, not noise."
  },
  {
    icon: Server,
    title: "System Hardening",
    desc: "Architecture review and hardening of critical systems within the RSR environment. Defense in depth."
  },
  {
    icon: Bell,
    title: "Protective Alerts",
    desc: "Rapid internal notification and escalation when threat indicators emerge. Fast signal, clear chain of response."
  }
];

/* ——— Status rows data ——— */
const statusRows = [
  { label: "Protective Posture", value: "ACTIVE", live: true },
  { label: "Network Integrity", value: "STABLE", live: false },
  { label: "Exposure Monitoring", value: "ENABLED", live: false },
  { label: "Internal Routing", value: "SECURED", live: false },
  { label: "Analyst Support", value: "AVAILABLE", live: false },
];

/* ——— Network nodes data ——— */
const networkNodes = [
  {
    id: "RSR-01",
    label: "RSR INTEL",
    badge: "HUB",
    desc: "Primary intelligence hub. Analysis, synthesis, and dissemination.",
    link: "https://www.rsrintel.com",
    linkLabel: "Access Node",
    active: false,
  },
  {
    id: "AXN-02",
    label: "AXION",
    badge: "SYSTEMS",
    desc: "Autonomous operations and systems integration layer.",
    link: null,
    linkLabel: "Internal Only",
    active: false,
  },
  {
    id: "STX-03",
    label: "SENTRIX",
    badge: "SIGINT",
    desc: "Signals intelligence and environmental monitoring division.",
    link: null,
    linkLabel: "Internal Only",
    active: false,
  },
  {
    id: "BDS-04",
    label: "BLACK DOG",
    badge: "ACTIVE",
    desc: "Protective operations and security. This node.",
    link: null,
    linkLabel: null,
    active: true,
  },
];

/* ——— Main component ——— */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [submittedId, setSubmittedId] = React.useState<string | null>(null);
  const { toast } = useToast();
  const submitRequest = useSubmitRequest();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", organization: "", email: "", subject: "", requestType: "", message: "" }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await submitRequest.mutateAsync({ data: { ...values, linkedSystem: "General" } });
      setSubmittedId(result.displayId || result.id.slice(0, 8).toUpperCase());
      form.reset();
    } catch {
      toast({
        title: "Submission Failed",
        description: "An error occurred. Please try again.",
        duration: 5000,
      });
    }
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-primary/20 selection:text-primary">

      {/* Background textures */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25 bg-grid" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] bg-scanline" />

      {/* ——— NAVBAR ——— */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[hsl(220,16%,4%)]/90 backdrop-blur-xl py-3.5 px-6 md:px-12 flex justify-between items-center">
        <div className="font-display font-semibold tracking-[0.06em] text-[11px] flex items-center gap-3 text-white uppercase">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-primary opacity-80">
            <path d="M10 2L18 6V14L10 18L2 14V6Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <circle cx="10" cy="10" r="2.5" fill="currentColor"/>
          </svg>
          Black Dog Security
        </div>

        <nav className="hidden md:flex items-center gap-7 font-display text-[10px] tracking-wider">
          {['capabilities', 'posture', 'network', 'access'].map(id => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-white/45 hover:text-white/90 transition-colors uppercase tracking-[0.14em]"
            >
              {id}
            </button>
          ))}
          <div className="w-px h-3.5 bg-white/10 mx-1" />
          <a
            href="https://www.rsrintel.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-primary/80 hover:text-primary transition-colors"
          >
            RSR Intel <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </nav>

        <button className="md:hidden text-white/50 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[hsl(220,16%,4%)]/98 backdrop-blur-xl pt-20 px-6 flex flex-col gap-5 font-display md:hidden border-b border-white/[0.06]">
          {['capabilities', 'posture', 'network', 'access'].map(id => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-left text-base text-white/50 hover:text-white uppercase tracking-widest transition-colors py-1"
            >
              {id}
            </button>
          ))}
          <div className="h-px w-full bg-white/[0.06] my-1" />
          <a
            href="https://www.rsrintel.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-primary text-sm"
          >
            RSR Intel <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <main className="relative z-10 flex flex-col">

        {/* ——— HERO ——— */}
        <section className="min-h-[100dvh] flex flex-col justify-center items-center text-center px-6 pt-16 relative overflow-hidden">
          <div className="hero-vignette absolute inset-0 pointer-events-none" />

          {/* Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mb-10"
          >
            <BlackDogEmblem />
          </motion.div>

          {/* Headline block */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl z-10"
          >
            <motion.div variants={fadeInUp} className="section-label mb-5 opacity-60">
              RSR Intelligence Network // Protective Division
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-[4.5rem] font-bold tracking-[0.02em] mb-3 text-white uppercase leading-none"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Black Dog Security
            </motion.h1>

            <motion.h2
              variants={fadeInUp}
              className="text-base md:text-lg text-white/40 font-display tracking-[0.06em] uppercase mb-8"
            >
              Protective Operations for the RSR Network
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-white/65 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            >
              BLACK DOG manages protective posture, operational security, exposure monitoring,
              system hardening, and internal security support for the RSR Intelligence Network.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => scrollTo('access')}
                className="bg-primary text-primary-foreground hover:bg-primary/85 h-11 px-8 font-display text-[10px] tracking-[0.08em] uppercase rounded-sm transition-all hover:shadow-[0_0_18px_rgba(150,45,65,0.25)]"
              >
                Request Briefing
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 px-8 font-display text-[10px] tracking-[0.08em] uppercase rounded-sm bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/18 text-white/70 hover:text-white transition-all"
              >
                <a href="https://www.rsrintel.com" target="_blank" rel="noreferrer">
                  Return to RSR Intel
                </a>
              </Button>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 flex items-center justify-center gap-2 text-white/20 font-mono text-[10px] tracking-widest uppercase"
            >
              <div className="w-px h-8 bg-white/10" />
              <span>Scroll</span>
              <div className="w-px h-8 bg-white/10" />
            </motion.div>
          </motion.div>
        </section>

        {/* ——— CAPABILITIES ——— */}
        <section id="capabilities" className="py-20 px-6 md:px-12 max-w-6xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="section-label mb-3">Capabilities</motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold mb-10 text-white"
            >
              Core Capabilities
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilities.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="glass-panel card-hover p-6 rounded-sm group cursor-default"
                >
                  <div className="flex items-start justify-between mb-5">
                    <item.icon className="w-5 h-5 text-white/25 group-hover:text-primary transition-colors duration-300" />
                    <span className="font-mono text-[9px] tracking-widest text-white/15 uppercase">
                      BDS-{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2.5 tracking-[0.04em]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {item.title}
                  </h4>
                  <p className="text-white/55 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ——— SECURITY POSTURE PANEL ——— */}
        <section id="posture" className="py-20 px-6 md:px-12 max-w-4xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <div className="section-label mb-3">Status</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
              Security Posture
            </h2>

            {/* Command card */}
            <div className="glass-panel rounded-sm overflow-hidden">
              {/* Panel header bar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-white/[0.015]">
                <div className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
                  BDS // Posture Readout v2.1
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot"
                    style={{ boxShadow: '0 0 6px rgba(160,50,70,0.7)' }}
                  />
                  <span className="font-mono text-[9px] tracking-widest text-primary/70 uppercase">Live</span>
                </div>
              </div>

              {/* Status rows */}
              <div className="px-6 py-2 font-mono text-sm relative">
                {/* Faint background grid */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '100% 56px',
                  }}
                />

                {statusRows.map((row, i) => (
                  <div
                    key={i}
                    className="relative z-10 flex items-center justify-between py-[14px] border-b border-white/[0.05] last:border-b-0"
                  >
                    {/* Left: label */}
                    <div className="flex items-center gap-3">
                      <div className="w-px h-4 bg-white/10" />
                      <span className="text-white/45 text-xs tracking-wider">{row.label}</span>
                    </div>

                    {/* Right: value + indicator */}
                    <div className="flex items-center gap-3">
                      <span className="text-white text-xs tracking-widest font-medium">{row.value}</span>
                      {row.live ? (
                        <div
                          className="w-2 h-2 rounded-full bg-primary pulse-dot"
                          style={{ boxShadow: '0 0 6px rgba(160,50,70,0.6)' }}
                        />
                      ) : (
                        <div
                          className="w-2 h-2 rounded-full steel-dot"
                          style={{ backgroundColor: 'rgba(200,210,220,0.35)' }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel footer */}
              <div className="px-6 py-3 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase">
                  Classification // Internal
                </span>
                <span className="font-mono text-[9px] text-white/20">
                  Last Assessment: {dateStr} // Automated
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ——— NETWORK ECOSYSTEM ——— */}
        <section id="network" className="py-20 px-6 md:px-12 max-w-6xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="section-label mb-3">Topology</motion.div>
            <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold mb-3 text-white">
              RSR Network Ecosystem
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/45 text-sm mb-10 font-mono max-w-lg">
              BLACK DOG operates as the protective security layer within a wider intelligence framework.
            </motion.p>

            <div className="relative">
              {/* Connector line (desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-4 right-4 -translate-y-1/2 z-0 pointer-events-none">
                <div
                  className="w-full h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 2%, rgba(255,255,255,0.07) 15%, rgba(255,255,255,0.07) 85%, transparent 98%)',
                  }}
                />
                {/* Connector dots */}
                {[25, 50, 75].map(pct => (
                  <div
                    key={pct}
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                    style={{ left: `${pct}%`, backgroundColor: 'rgba(255,255,255,0.12)' }}
                  />
                ))}
              </div>

              <div className="flex flex-col lg:flex-row gap-3 relative z-10">
                {networkNodes.map((node, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className={`flex-1 glass-panel rounded-sm p-5 flex flex-col ${node.active ? 'node-active' : ''}`}
                  >
                    {/* Node header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-mono text-[9px] text-white/25 tracking-widest mb-1">
                          NODE // {node.id}
                        </div>
                        <span
                          className={`font-mono text-sm font-semibold tracking-wider ${node.active ? 'text-primary' : 'text-white/80'}`}
                        >
                          {node.label}
                        </span>
                      </div>
                      <div
                        className={`px-2 py-0.5 rounded-[2px] font-mono text-[9px] tracking-wider border ${
                          node.active
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'bg-white/[0.03] text-white/30 border-white/[0.08]'
                        }`}
                      >
                        {node.badge}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/45 text-xs leading-relaxed mb-4 flex-grow">{node.desc}</p>

                    {/* Footer */}
                    <div className="mt-auto">
                      {node.link ? (
                        <a
                          href={node.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          {node.linkLabel} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : node.active ? (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-primary/70">
                          <div
                            className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot"
                            style={{ boxShadow: '0 0 5px rgba(160,50,70,0.6)' }}
                          />
                          Online // Protective Layer Active
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-white/20">{node.linkLabel}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ——— ACCESS / CONTACT ——— */}
        <section id="access" className="py-20 px-6 md:px-12 max-w-2xl mx-auto w-full mb-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <div className="section-label mb-3">Clearance</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              Request Access
            </h2>
            <p className="text-white/45 text-sm mb-8 font-mono">
              BLACK DOG operates on a need-to-know basis. All submissions are reviewed and logged.
            </p>

            <div className="glass-panel rounded-sm p-6 md:p-8">
              {/* Form header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                <span className="font-mono text-[9px] tracking-widest text-white/25 uppercase">
                  Form // BDS-ACCESS-01
                </span>
                <span className="font-mono text-[9px] text-white/20">
                  Restricted Intake
                </span>
              </div>

              {submittedId ? (
                <div className="py-10 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-5">
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-mono text-sm text-white tracking-wide mb-3">Request Logged</div>
                  <div className="inline-block border border-[hsl(350,46%,46%)]/30 bg-[hsl(350,46%,46%)]/[0.06] rounded-sm px-5 py-2.5 mb-4">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">Reference ID</div>
                    <div className="font-mono text-lg text-white tracking-widest">{submittedId}</div>
                  </div>
                  <div className="font-mono text-xs text-white/35 leading-relaxed max-w-xs mx-auto">
                    Your submission is queued for secure review. Retain your reference ID for follow-up.
                  </div>
                  <button
                    onClick={() => setSubmittedId(null)}
                    className="mt-6 font-mono text-[10px] uppercase tracking-widest text-white/25 hover:text-white/55 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
                              Name / Callsign
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter identifier"
                                className="tactical-input bg-black/50 border-white/10 font-mono text-xs h-10 rounded-sm focus:border-primary/40 focus:ring-0 text-white placeholder:text-white/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-primary text-[10px] font-mono" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
                              Organization
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Affiliation"
                                className="tactical-input bg-black/50 border-white/10 font-mono text-xs h-10 rounded-sm focus:border-primary/40 focus:ring-0 text-white placeholder:text-white/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-primary text-[10px] font-mono" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
                              Contact Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="secure@domain.com"
                                className="tactical-input bg-black/50 border-white/10 font-mono text-xs h-10 rounded-sm focus:border-primary/40 focus:ring-0 text-white placeholder:text-white/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-primary text-[10px] font-mono" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
                              Subject
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Brief subject line"
                                className="tactical-input bg-black/50 border-white/10 font-mono text-xs h-10 rounded-sm focus:border-primary/40 focus:ring-0 text-white placeholder:text-white/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-primary text-[10px] font-mono" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="requestType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
                            Request Classification
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/10 font-mono text-xs h-10 rounded-sm text-white/60 data-[placeholder]:text-white/20 focus:ring-0 focus:border-primary/40">
                                <SelectValue placeholder="Select nature of inquiry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[hsl(218,18%,7%)] border-white/10 font-mono text-xs text-white/70 rounded-sm">
                              <SelectItem value="inquiry">General Inquiry</SelectItem>
                              <SelectItem value="briefing">Security Briefing</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-primary text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
                            Message / Justification
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Detail your request and clearance context..."
                              className="tactical-input bg-black/50 border-white/10 font-mono text-xs min-h-[100px] resize-y rounded-sm focus:border-primary/40 focus:ring-0 text-white placeholder:text-white/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-primary text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={submitRequest.isPending}
                      className="w-full bg-primary hover:bg-primary/85 disabled:opacity-60 text-primary-foreground font-mono text-[10px] tracking-[0.2em] uppercase h-11 rounded-sm transition-all hover:shadow-[0_0_18px_rgba(150,45,65,0.2)]"
                    >
                      {submitRequest.isPending ? "Transmitting..." : "Initiate Secure Request"}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="mt-5 pt-4 border-t border-white/[0.05]">
                <p className="text-[9px] text-white/20 font-mono text-center tracking-wide">
                  All submissions are reviewed and logged. Unauthorized access attempts are monitored and reported.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ——— FOOTER ——— */}
      <footer className="border-t border-white/[0.06] bg-[hsl(220,16%,3%)]/80 backdrop-blur-sm py-6 px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs text-white/30 tracking-wider">
            <span className="text-white/60">BLACK DOG SECURITY</span> // RSR Intelligence Network
          </div>

          <div className="flex gap-5 font-mono text-[10px] text-white/25 tracking-widest uppercase">
            {['capabilities', 'posture', 'network', 'access'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-white/50 transition-colors">
                {id}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 font-mono text-[10px] text-white/30 bg-white/[0.02] px-3 py-1.5 rounded-[2px] border border-white/[0.06]">
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot"
              style={{ boxShadow: '0 0 5px rgba(160,50,70,0.5)' }}
            />
            <span className="tracking-widest uppercase text-white/40">Protective Layer Online</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">
          <span className="font-mono text-[9px] text-white/15 tracking-widest">
            &copy; 2026 RSR INTELLIGENCE NETWORK. ALL RIGHTS RESERVED. // INTERNAL USE ONLY.
          </span>
          <a
            href="/commander/login"
            className="font-mono text-[9px] text-white/15 hover:text-white/40 tracking-widest uppercase transition-colors duration-300 border-b border-transparent hover:border-white/20 pb-px"
          >
            Operator Access
          </a>
        </div>
      </footer>
    </div>
  );
}
