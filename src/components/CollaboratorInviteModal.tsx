
import React, { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { usePrivy } from "@privy-io/react-auth";

interface CollaboratorInviteModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onInvited: () => void;
}

export const CollaboratorInviteModal: React.FC<CollaboratorInviteModalProps> = ({
  open, onClose, projectId, onInvited,
}) => {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { user } = usePrivy();

  async function handleInvite() {
    setErr(null);
    setIsLoading(true);
    try {
      if (!user?.id) {
        setErr("Not authenticated.");
        setIsLoading(false);
        return;
      }
      if (!email && !wallet) {
        setErr("Email or wallet required.");
        setIsLoading(false);
        return;
      }
      const { error } = await supabase.from("project_collaborators").insert({
        project_id: projectId,
        invited_by: user.id,
        invited_email: email || null,
        invited_wallet: wallet || null,
        status: "pending",
      });
      if (!error) {
        onInvited();
        setEmail("");
        setWallet("");
        onClose();
      } else {
        setErr(error.message || "Failed to send invite.");
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setIsLoading(false);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-xs relative">
        <button className="absolute right-2 top-2 text-lg" onClick={onClose}>&times;</button>
        <h3 className="font-bold mb-2">Invite Collaborator</h3>
        <input
          className="w-full mb-2 p-2 rounded bg-[#232323] border border-border text-body-text"
          placeholder="Collaborator Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="text-xs text-body-text/60 mb-2">or</div>
        <input
          className="w-full mb-2 p-2 rounded bg-[#232323] border border-border text-body-text"
          placeholder="Wallet Address (0x...)"
          value={wallet}
          onChange={e => setWallet(e.target.value)}
        />
        {err && <div className="text-red-500 text-[13px] mb-1">{err}</div>}
        <Button className="w-full mt-2" onClick={handleInvite} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Invite"}
        </Button>
      </div>
    </div>
  );
};
