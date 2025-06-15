
import React, { useState, useEffect } from "react";

interface AddRoleModalProps {
  open: boolean;
  defaultRole?: { roleName: string; walletAddress: string; percent: number };
  onClose: () => void;
  onSave: (role: { roleName: string; walletAddress: string; percent: number }) => void;
  existingRoles: { roleName: string; percent: number }[];
}

export const AddRoleModal: React.FC<AddRoleModalProps> = ({
  open,
  defaultRole,
  onClose,
  onSave,
  existingRoles,
}) => {
  const [roleName, setRoleName] = useState(defaultRole?.roleName || "");
  const [walletAddress, setWalletAddress] = useState(defaultRole?.walletAddress || "");
  const [percentStr, setPercentStr] = useState(
    defaultRole && typeof defaultRole.percent === "number"
      ? defaultRole.percent.toString()
      : ""
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRoleName(defaultRole?.roleName || "");
    setWalletAddress(defaultRole?.walletAddress || "");
    setPercentStr(
      defaultRole && typeof defaultRole.percent === "number"
        ? defaultRole.percent.toString()
        : ""
    );
    setError(null);
  }, [open, defaultRole]);

  function handleSave() {
    if (!roleName.trim()) return setError("Role name required");
    if (!walletAddress.trim()) return setError("Wallet address required");
    // Allow empty for now, treat as 0 (let rebalancer sort it out)
    let percent = percentStr === "" ? 0 : Number(percentStr);
    // Clamp percent between 0 and 100
    if (Number.isNaN(percent) || percent < 0 || percent > 100) return setError("Percent must be 0–100");
    onSave({ roleName: roleName.trim(), walletAddress: walletAddress.trim(), percent });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-xs relative">
        <button className="absolute right-2 top-2 text-lg" onClick={onClose}>&times;</button>
        <h3 className="font-bold mb-2">Add/Edit Role</h3>
        <input
          className="w-full mb-2 p-2 rounded bg-[#232323] border border-border text-body-text"
          placeholder="Role Name (e.g. Producer)"
          value={roleName}
          onChange={e => setRoleName(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 rounded bg-[#232323] border border-border text-body-text"
          placeholder="Wallet Address (0x…)"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 rounded bg-[#232323] border border-border text-body-text"
          type="number"
          min={0}
          max={100}
          placeholder="Percent"
          value={percentStr}
          onChange={e => {
            // Accept any numeric input up to 3 digits, can be blank, but not negative
            const v = e.target.value;
            if (v === "" || (/^\d{0,3}$/.test(v) && Number(v) >= 0 && Number(v) <= 100)) {
              setPercentStr(v);
            }
          }}
          onFocus={() => setPercentStr(percentStr === "0" ? "" : percentStr)}
        />
        {error && <div className="text-red-500 text-[13px] mb-1">{error}</div>}
        <button className="accent-btn w-full mt-2" onClick={handleSave}>Save Role</button>
      </div>
    </div>
  );
};
