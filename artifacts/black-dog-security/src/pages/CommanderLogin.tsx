import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { commanderLogin } from "@workspace/api-client-react";
import { useCommanderAuth } from "@/hooks/useCommanderAuth";

export default function CommanderLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveToken } = useCommanderAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await commanderLogin({ username, password });
      saveToken(result.token);
      navigate("/commander");
    } catch {
      setError("Invalid credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,16%,4%)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="border border-[hsl(350,46%,46%)]/30 bg-white/[0.03] backdrop-blur-sm rounded-sm p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[hsl(350,46%,46%)]" />
              <span className="font-mono text-xs text-[hsl(350,46%,46%)] tracking-[0.2em] uppercase">
                Restricted Access
              </span>
              <div className="w-2 h-2 rounded-full bg-[hsl(350,46%,46%)]" />
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-wide">
              Commander Center
            </h1>
            <p className="text-sm text-white/40 mt-1 font-mono">
              BLACK DOG SECURITY — RSR Intel Network
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-white/50 uppercase tracking-widest mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full bg-white/[0.04] border border-white/10 rounded-sm px-4 py-3 text-white text-sm font-mono outline-none focus:border-[hsl(350,46%,46%)]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-white/50 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-white/[0.04] border border-white/10 rounded-sm px-4 py-3 text-white text-sm font-mono outline-none focus:border-[hsl(350,46%,46%)]/60 transition-colors"
              />
            </div>

            {error && (
              <p className="font-mono text-xs text-[hsl(350,46%,46%)] border border-[hsl(350,46%,46%)]/30 rounded-sm px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[hsl(350,46%,46%)] hover:bg-[hsl(350,46%,52%)] disabled:opacity-50 text-white font-mono text-xs tracking-widest uppercase py-3 rounded-sm transition-colors mt-2"
            >
              {loading ? "Authenticating..." : "Authenticate"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <a
              href="/"
              className="font-mono text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Return to Main Site
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
