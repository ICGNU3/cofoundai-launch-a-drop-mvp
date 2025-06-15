
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";
import { getSessionUser } from "@/hooks/usePrivy"; // (assume a helper to get user ID from session)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { projectId, email, wallet } = req.body;
  if (!projectId || (!email && !wallet))
    return res.status(400).json({ error: "Email or wallet required" });
  // Get current user (assume Privy session)
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  // Insert invite
  const { error } = await supabase.from("project_collaborators").insert({
    project_id: projectId,
    invited_by: user.id,
    invited_email: email || null,
    invited_wallet: wallet || null,
    status: "pending",
  });
  if (error) {
    return res.status(500).json({ error: "Failed: " + error.message });
  }
  return res.json({ ok: true });
}
