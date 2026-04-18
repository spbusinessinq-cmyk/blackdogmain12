import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Shield, Eye, Lock, AlertTriangle, Server, Bell, 
  Menu, X, ExternalLink, Activity, Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  organization: z.string().min(2, "Organization is required"),
  requestType: z.string().min(1, "Request type is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      organization: "",
      requestType: "",
      message: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Request Submitted",
      description: "Your access request has been securely logged for review.",
      duration: 5000,
    });
    form.reset();
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-primary/30 selection:text-primary">
      {/* Texture overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-grid" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-scanline" />
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-x-0 border-t-0 py-4 px-6 md:px-12 flex justify-between items-center rounded-none">
        <div className="font-mono font-bold tracking-widest text-lg flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <span>BLACK DOG SECURITY</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-sm">
          <button onClick={() => scrollTo('capabilities')} className="text-muted-foreground hover:text-white transition-colors">Capabilities</button>
          <button onClick={() => scrollTo('posture')} className="text-muted-foreground hover:text-white transition-colors">Posture</button>
          <button onClick={() => scrollTo('network')} className="text-muted-foreground hover:text-white transition-colors">Network</button>
          <button onClick={() => scrollTo('access')} className="text-muted-foreground hover:text-white transition-colors">Access</button>
          <div className="w-px h-4 bg-border mx-2" />
          <a href="https://www.rsrintel.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            Return to RSR Intel <ExternalLink className="w-3 h-3" />
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-muted-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 font-mono md:hidden">
          <button onClick={() => scrollTo('capabilities')} className="text-left text-lg text-muted-foreground hover:text-white">Capabilities</button>
          <button onClick={() => scrollTo('posture')} className="text-left text-lg text-muted-foreground hover:text-white">Posture</button>
          <button onClick={() => scrollTo('network')} className="text-left text-lg text-muted-foreground hover:text-white">Network</button>
          <button onClick={() => scrollTo('access')} className="text-left text-lg text-muted-foreground hover:text-white">Access</button>
          <div className="h-px w-full bg-border my-2" />
          <a href="https://www.rsrintel.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary">
            Return to RSR Intel <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      <main className="relative z-10 flex flex-col">
        
        {/* HERO SECTION */}
        <section className="min-h-[100dvh] flex flex-col justify-center items-center text-center px-6 pt-20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-12"
          >
            {/* Geometric abstract shield */}
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-primary/40">
              <path d="M60 10L110 30V65C110 90 60 110 60 110C60 110 10 90 10 65V30L60 10Z" stroke="currentColor" strokeWidth="1" />
              <path d="M60 25L95 40V65C95 82 60 97 60 97C60 97 25 82 25 65V40L60 25Z" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="60" cy="60" r="15" stroke="currentColor" strokeWidth="1" />
              <circle cx="60" cy="60" r="3" fill="currentColor" className="text-primary pulse-dot" />
            </svg>
            <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full" />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl z-10">
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white uppercase">
              Black Dog Security
            </motion.h1>
            <motion.h2 variants={fadeInUp} className="text-xl md:text-2xl text-primary font-mono mb-6 tracking-wide">
              Protective Operations for the RSR Network
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              BLACK DOG handles protective posture, operational security, exposure monitoring, system hardening, and internal security support for the RSR Intelligence Network.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => scrollTo('access')} className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-mono tracking-wide rounded hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                Request Briefing
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 font-mono tracking-wide rounded bg-card/50 backdrop-blur border-border hover:bg-card hover:text-white transition-all">
                <a href="https://www.rsrintel.com" target="_blank" rel="noreferrer">
                  Return to RSR Intel
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* CAPABILITIES SECTION */}
        <section id="capabilities" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h3 variants={fadeInUp} className="text-sm font-mono text-primary tracking-widest mb-2 uppercase">Capabilities</motion.h3>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-12 text-white">CORE CAPABILITIES</motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "Operational Security", desc: "Protecting personnel, assets, and information across all RSR operational environments. Threat-aware posture maintained at all times." },
                { icon: Eye, title: "Exposure Monitoring", desc: "Continuous monitoring of digital exposure vectors, surface-level vulnerabilities, and unauthorized information presence. Proactive, not reactive." },
                { icon: Lock, title: "Information Protection", desc: "Strict handling protocols for sensitive intelligence and classified operational material. Zero-tolerance for unauthorized disclosure." },
                { icon: AlertTriangle, title: "Threat Awareness", desc: "Ongoing assessment of threat landscapes relevant to RSR personnel and network assets. Actionable intelligence, not noise." },
                { icon: Server, title: "System Hardening", desc: "Architecture review and hardening of critical systems within the RSR environment. Defense in depth." },
                { icon: Bell, title: "Protective Alerts", desc: "Rapid internal notification and escalation when threat indicators emerge. Fast signal, clear chain of response." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="glass-panel p-8 rounded hover:-translate-y-1 transition-transform duration-300 group cursor-default">
                  <item.icon className="w-8 h-8 text-muted-foreground mb-6 group-hover:text-primary transition-colors" />
                  <h4 className="text-lg font-semibold text-white mb-3">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* POSTURE SECTION */}
        <section id="posture" className="py-24 px-6 md:px-12 max-w-5xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h3 className="text-sm font-mono text-primary tracking-widest mb-2 uppercase">Status</h3>
            <h2 className="text-3xl font-bold mb-12 text-white">CURRENT SECURITY POSTURE</h2>

            <div className="glass-panel rounded-lg p-1 relative overflow-hidden font-mono text-sm">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />
              
              <div className="bg-background/80 p-6 md:p-8 rounded relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Protective Posture</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold tracking-wide">ACTIVE</span>
                    <div className="w-2 h-2 rounded-full bg-primary pulse-dot shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Network Integrity</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white">STABLE</span>
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Exposure Monitoring</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white">ENABLED</span>
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Internal Routing</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white">SECURED</span>
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                  </div>
                </div>

                <div className="flex items-center justify-between pb-6">
                  <span className="text-muted-foreground">Analyst Support</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white">AVAILABLE</span>
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                  </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground/60 text-right">
                  Last Assessment: {currentDate} // Automated
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* NETWORK SECTION */}
        <section id="network" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h3 variants={fadeInUp} className="text-sm font-mono text-primary tracking-widest mb-2 uppercase">Topology</motion.h3>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-4 text-white">RSR NETWORK ECOSYSTEM</motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground mb-12 max-w-2xl">
              BLACK DOG operates as the protective security layer within a wider intelligence framework.
            </motion.p>

            <div className="flex flex-col lg:flex-row items-stretch gap-4 relative">
              {/* Desktop connector line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 z-0" />
              
              <motion.div variants={fadeInUp} className="flex-1 glass-panel p-6 rounded relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-sm text-white">RSR INTEL</span>
                  <div className="px-2 py-1 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border">HUB</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">Primary intelligence hub. Analysis, synthesis, and dissemination.</p>
                <a href="https://www.rsrintel.com" target="_blank" rel="noreferrer" className="text-xs font-mono text-primary hover:text-primary/80 flex items-center gap-1 mt-auto">
                  Access Node <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex-1 glass-panel p-6 rounded relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-sm text-white">AXION</span>
                  <div className="px-2 py-1 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border">SYSTEMS</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">Autonomous operations and systems integration layer.</p>
                <div className="text-xs font-mono text-muted-foreground/50 mt-auto">Internal Only</div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex-1 glass-panel p-6 rounded relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-sm text-white">SENTRIX</span>
                  <div className="px-2 py-1 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border">SIGINT</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">Signals intelligence and environmental monitoring division.</p>
                <div className="text-xs font-mono text-muted-foreground/50 mt-auto">Internal Only</div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex-1 glass-panel p-6 rounded relative z-10 border-primary/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-sm text-primary font-bold">BLACK DOG</span>
                  <div className="px-2 py-1 rounded bg-primary/10 text-[10px] font-mono text-primary border border-primary/30">ACTIVE</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">Protective operations and security. This node.</p>
                <div className="text-xs font-mono text-primary flex items-center gap-2 mt-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" /> Online
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* ACCESS SECTION */}
        <section id="access" className="py-24 px-6 md:px-12 max-w-3xl mx-auto w-full mb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h3 className="text-sm font-mono text-primary tracking-widest mb-2 uppercase">Clearance</h3>
            <h2 className="text-3xl font-bold mb-4 text-white">REQUEST ACCESS</h2>
            <p className="text-muted-foreground mb-8">
              BLACK DOG operates on a need-to-know basis. Submit your request for review.
            </p>

            <div className="glass-panel p-8 rounded-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-mono text-xs uppercase">Name / Callsign</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter identifier" className="bg-background/50 border-border font-mono text-sm h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-mono text-xs uppercase">Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Affiliation" className="bg-background/50 border-border font-mono text-sm h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="requestType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-mono text-xs uppercase">Request Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border font-mono text-sm h-11">
                              <SelectValue placeholder="Select nature of inquiry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-border font-mono text-sm text-white">
                            <SelectItem value="inquiry">General Inquiry</SelectItem>
                            <SelectItem value="briefing">Security Briefing</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-mono text-xs uppercase">Message / Justification</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detail your request..." 
                            className="bg-background/50 border-border font-mono text-sm min-h-[120px] resize-y" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono tracking-widest uppercase h-12">
                    Submit Request
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground/60 font-mono">
                  All submissions are reviewed and logged. Unauthorized access attempts are monitored.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border relative z-10 glass-panel rounded-none border-x-0 border-b-0 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-sm text-muted-foreground">
            <span className="text-white">BLACK DOG SECURITY</span> // RSR Intelligence Network
          </div>
          
          <div className="flex gap-6 font-mono text-xs text-muted-foreground">
            <button onClick={() => scrollTo('capabilities')} className="hover:text-white transition-colors">Capabilities</button>
            <button onClick={() => scrollTo('posture')} className="hover:text-white transition-colors">Posture</button>
            <button onClick={() => scrollTo('network')} className="hover:text-white transition-colors">Network</button>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-primary bg-primary/5 px-3 py-1.5 rounded border border-primary/10">
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            Protective Layer Online
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-border/30 text-center font-mono text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} RSR Intelligence Network. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
