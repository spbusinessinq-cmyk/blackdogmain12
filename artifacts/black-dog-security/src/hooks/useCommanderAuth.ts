import { useState, useCallback } from "react";

export const TOKEN_KEY = "bds_commander_token";

export function useCommanderAuth() {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(TOKEN_KEY)
  );

  const saveToken = useCallback((t: string) => {
    sessionStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  }, []);

  const clearToken = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return { token, isAuthenticated: !!token, saveToken, clearToken };
}
