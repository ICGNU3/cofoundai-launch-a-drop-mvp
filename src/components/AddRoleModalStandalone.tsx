
import React, { useState, useEffect } from "react";

interface AddRoleModalStandaloneProps {
  open: boolean;
  onClose: () => void;
  onAdd: (role: { name: string; wallet: string }) => void;
}

export const AddRoleModalStandalone: React.FC<AddRoleModalStandaloneProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setWallet("");
    }
  }, [open]);

  function handleAdd() {
    if (name.trim().length === 0) return;
    onAdd({ name: name.trim(), wallet: wallet.trim() });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-[#242226] p-6 rounded-lg shadow-lg border border-border w-full max-w-xs relative">
        <button className="absolute top-2 right-3 text-xl" onClick={onClose}>
          ×
        </button>
        <h3 className="font-bold mb-2">Add Role</h3>
        <input
          placeholder="Role Name"
          className="mb-2 w-full p-2 rounded bg-[#19191b] border border-border"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Wallet Address"
          className="mb-2 w-full p-2 rounded bg-[#19191b] border border-border"
          value={wallet}
          onChange={e => setWallet(e.target.value)}
        />
        <button
          className="accent-btn w-full mt-1"
          onClick={handleAdd}
          disabled={!name.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
};
