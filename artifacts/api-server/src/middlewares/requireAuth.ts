import { Request, Response, NextFunction } from "express";
import { tokenStore } from "../lib/tokenStore.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  if (!tokenStore.has(token)) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  next();
}
