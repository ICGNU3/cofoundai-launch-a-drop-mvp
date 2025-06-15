import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Undo, Redo } from "lucide-react";
import { ProgressBar } from "./ui/PercentBar";
import { cn } from "@/lib/utils";

type Role = {
  id: string;
  name: string;
  wallet: string;
  percent: number;
  // For possible tiered sub-roles
  subRoles?: Role[];
};

type Preset = {
  label: string;
  roles: { name: string; percent: number }[];
};

const PRESETS: Preset[] = [
  { label: "Music", roles: [
    { name: "Artist", percent: 50 },
    { name: "Producer", percent: 20 },
    { name: "Label", percent: 20 },
    { name: "Manager", percent: 10 },
  ]},
  { label: "Film", roles: [
    { name: "Director", percent: 40 },
    { name: "Producer", percent: 30 },
    { name: "DP", percent: 15 },
    { name: "Writer", percent: 15 }
  ]},
  { label: "Fashion", roles: [
    { name: "Designer", percent: 60 },
    { name: "Producer", percent: 20 },
    { name: "Model", percent: 20 }
  ]},
  { label: "Art", roles: [
    { name: "Artist", percent: 100 }
  ]}
];

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function proportionalRebalance(roles: Role[], changing: number, newValue: number): Role[] {
  // Returns a new roles array where `roles[changing]` gets `newValue`,
  // others are proportionally resized to keep sum at 100.
  // Negative percents become 0.
  if (roles.length === 1) return [{ ...roles[0], percent: 100 }];
  const total = roles.reduce((s, r) => s + r.percent, 0);
  const delta = newValue - roles[changing].percent;
  let remainSum = 0;
  roles.forEach((r, i) => { if (i !== changing) remainSum += r.percent; });

  let next = roles.map((r, i) => {
    if (i === changing) return { ...r, percent: newValue };
    if (remainSum === 0) return { ...r, percent: (100 - newValue) / (roles.length - 1) };
    let prop = r.percent / remainSum;
    let p = Math.max(0, r.percent - prop * delta);
    return { ...r, percent: p };
  });

  // Final normalization
  let sum = next.reduce((s, r) => s + r.percent, 0);
  if (Math.abs(sum - 100) > 0.01) {
    // Nudge first role to correct for rounding
    next[0].percent += 100 - sum;
  }
  // Avoid any negative percents
  return next.map(r => ({ ...r, percent: Math.max(0, Math.round(r.percent * 10) / 10) }));
}

const colorByPercent = (sum: number) => {
  if (sum < 100) return "bg-amber-400";
  if (sum > 100) return "bg-red-500";
  return "bg-green-500";
};

export const RoleAllocationPanel: React.FC<{}> = () => {
  // MAIN STATE
  const [roles, setRoles] = useState<Role[]>([
    { id: genId(), name: "Artist", wallet: "", percent: 50 },
    { id: genId(), name: "Producer", wallet: "", percent: 30 },
    { id: genId(), name: "Label", wallet: "", percent: 20 }
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", wallet: "" });
  const [editing, setEditing] = useState<string | null>(null); // id of pill being resized
  const [preset, setPreset] = useState("Music");
  // Undo/redo stacks
  const [history, setHistory] = useState<Role[][]>([]);
  const [future, setFuture] = useState<Role[][]>([]);

  // Derived/calculated
  const sum = Math.round(roles.reduce((s, r) => s + r.percent, 2) * 100) / 100;

  // Store state for undo
  const pushHistory = (next: Role[]) => {
    setHistory(h =>
      ((h.length > 8) ? [...h.slice(h.length - 8), roles] : [...h, roles])
    );
    setFuture([]);
    setRoles(next);
  };

  // Handle drag or +/- keyboard
  const handleResize = (i: number, newValue: number) => {
    if (newValue < 1) newValue = 1;
    if (newValue > 100) newValue = 100;
    const next = proportionalRebalance(roles, i, newValue);
    pushHistory(next);
  };

  // Pill +/- with keys
  const pillKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "+" || e.key === "=") {
      handleResize(i, roles[i].percent + 1);
    } else if (e.key === "-") {
      handleResize(i, roles[i].percent - 1);
    }
  };

  // Pill edge drag
  const dragStartIdx = useRef<number | null>(null);
  const dragStartX = useRef<number>(0);
  const dragStartPercent = useRef<number>(0);

  const handleMouseDown = (i: number, e: React.MouseEvent) => {
    dragStartIdx.current = i;
    dragStartX.current = e.clientX;
    dragStartPercent.current = roles[i].percent;
    setEditing(roles[i].id);
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onUp);
  };
  const onDrag = (e: MouseEvent) => {
    if (dragStartIdx.current == null) return;
    const deltaX = e.clientX - dragStartX.current;
    // Rule of thumb: 1px = 0.3% (tweak to preference)
    let diff = Math.round(deltaX * 0.3 * 10) / 10;
    let newPercent = Math.max(1, Math.min(100, dragStartPercent.current + diff));
    handleResize(dragStartIdx.current, newPercent);
  };
  const onUp = () => {
    dragStartIdx.current = null;
    setEditing(null);
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onUp);
  };
  useEffect(() => () => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onUp);
  }, []);

  // Add Role modal logic
  const handleAddRole = () => {
    if (!newRole.name.trim()) return;
    if (roles.length > 8) return; // Limit pills for now
    // 1. Give 10% to new pill, rebalance rest to 90%
    const base = { id: genId(), name: newRole.name, wallet: newRole.wallet, percent: 10 };
    let next = roles.map(r => ({ ...r, percent: Math.round((r.percent / 100) * 90 * 10) / 10 }));
    next = [ ...next, base ];
    // Final normalize
    let sum = next.reduce((s, r) => s + r.percent, 0);
    if (Math.abs(sum - 100) > 0.1) next[0].percent += 100 - sum;
    pushHistory(next);
    setNewRole({ name: "", wallet: "" });
    setAddOpen(false);
  };

  // Remove role
  const handleRemove = (idx: number) => {
    if (roles.length === 1) return;
    // Remove and spread among the others
    const removedPercent = roles[idx].percent;
    const remainers = roles.filter((_, i) => i !== idx);
    const total = remainers.reduce((s, r) => s + r.percent, 0);
    const next = remainers.map(r =>
      ({ ...r, percent: Math.round((r.percent + (r.percent / total) * removedPercent) * 10) / 10 })
    );
    // Normalize
    let sum = next.reduce((s, r) => s + r.percent, 0);
    if (Math.abs(sum - 100) > 0.01) next[0].percent += 100 - sum;
    pushHistory(next);
  };

  // Preset dropdown
  const handlePreset = (presetLabel: string) => {
    const p = PRESETS.find(t => t.label === presetLabel);
    if (p) {
      setPreset(p.label);
      setRoles(p.roles.map(r => ({
        id: genId(),
        name: r.name,
        wallet: "",
        percent: r.percent
      })));
      setHistory([]);
      setFuture([]);
    }
  };

  // Undo/Redo
  const undo = () => {
    if (!history.length) return;
    setFuture(f => [ roles, ...f ]);
    setRoles(history[history.length - 1]);
    setHistory(h => h.slice(0, h.length - 1));
  };
  const redo = () => {
    if (!future.length) return;
    setHistory(h => [ ...h, roles ]);
    setRoles(future[0]);
    setFuture(f => f.slice(1));
  };

  // ProgressBar coloring
  const barColor = sum === 100
    ? "bg-green-400"
    : sum < 100
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <div className="bg-[#18181a] p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-lg">Crew Split</span>
        <div className="ml-auto flex items-center gap-1">
          <button className="border p-1 rounded hover:bg-border" onClick={undo} disabled={!history.length}>
            <Undo size={16} />
          </button>
          <button className="border p-1 rounded hover:bg-border" onClick={redo} disabled={!future.length}>
            <Redo size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm">Preset:</label>
        <select
          value={preset}
          onChange={e => handlePreset(e.target.value)}
          className="bg-[#232323] border border-border rounded px-2 py-1 text-sm"
        >
          {PRESETS.map(p => (
            <option value={p.label} key={p.label}>{p.label}</option>
          ))}
        </select>
        <button
          className="ml-auto text-xs px-3 py-1 bg-accent text-white rounded hover:opacity-90"
          onClick={() => setAddOpen(true)}
        >
          <Plus size={16} className="inline align-middle mr-1" />
          Add Role
        </button>
      </div>
      {/* Live sum bar */}
      <div className="mt-1 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-sm">{sum.toFixed(2)}%</span>
          <span className={cn(
            "h-2 w-2 rounded-full inline-block",
            sum === 100 ? "bg-green-400" : sum < 100 ? "bg-amber-400" : "bg-red-400"
          )} />
          <span className={cn("text-xs", sum === 100 ? "text-green-400" : sum < 100 ? "text-amber-400" : "text-red-400")}>
            {sum === 100 ? "Cut balanced" : sum < 100 ? "Under" : "Over"}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full relative">
          <div
            style={{ width: `${Math.min(sum, 100)}%` }}
            className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
          />
        </div>
      </div>
      {/* Pills with drag/keyboard control */}
      <div className="flex flex-wrap gap-3 mt-4">
        {roles.map((role, i) => (
          <div
            key={role.id}
            tabIndex={0}
            onKeyDown={e => pillKeyDown(e, i)}
            className={cn(
              "flex items-center group role-pill select-none shadow-sm relative",
              editing === role.id && "animate-pulse border-accent border-2",
              "duration-150 transition-all"
            )}
            style={{
              minWidth: 80,
              background: "#232323",
            }}
          >
            <span className="font-medium">{role.name}</span>
            <span className="ml-1 font-mono">{role.percent.toFixed(1)}%</span>
            <button
              className="ml-2 text-destructive hover:bg-red-400/20 p-1 rounded hidden group-hover:block"
              title="Remove"
              onClick={() => handleRemove(i)}
              tabIndex={-1}
              style={{marginLeft: 6}}
              aria-label={`Remove role ${role.name}`}
            >×</button>
            {/* Drag handle: edge right */}
            <div
              className="h-full w-2 cursor-ew-resize absolute right-0 top-0 bottom-0 z-10"
              onMouseDown={e => handleMouseDown(i, e)}
              />
          </div>
        ))}
      </div>
      {/* Add Role Modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#242226] p-6 rounded-lg shadow-lg border border-border w-full max-w-xs relative">
            <button className="absolute top-2 right-3 text-xl" onClick={() => setAddOpen(false)}>
              ×
            </button>
            <h3 className="font-bold mb-2">Add Role</h3>
            <input
              placeholder="Role Name"
              className="mb-2 w-full p-2 rounded bg-[#19191b] border border-border"
              value={newRole.name}
              onChange={e => setNewRole(r => ({ ...r, name: e.target.value }))}
            />
            <input
              placeholder="Wallet Address"
              className="mb-2 w-full p-2 rounded bg-[#19191b] border border-border"
              value={newRole.wallet}
              onChange={e => setNewRole(r => ({ ...r, wallet: e.target.value }))}
            />
            <button
              className="accent-btn w-full mt-1"
              onClick={handleAddRole}
              disabled={!newRole.name.trim()}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
