import React, { useState, useEffect, useRef } from "react";
import { Plus, Undo, Redo } from "lucide-react";
// Removed unused ProgressBar import
// import { ProgressBar } from "./ui/PercentBar";
import { cn } from "@/lib/utils";
import { AddRoleModalStandalone } from "./AddRoleModalStandalone";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { proportionalRebalance } from "@/utils/roleRebalancer";

export type Role = {
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

const colorByPercent = (sum: number) => {
  if (sum < 100) return "bg-amber-400";
  if (sum > 100) return "bg-red-500";
  return "bg-green-500";
};

export const RoleAllocationPanel: React.FC<{}> = () => {
  // Use custom undo/redo hook for roles
  const {
    state: roles,
    set: setRolesWithHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setDirect: setRoles,
  } = useUndoRedo<Role[]>([
    { id: genId(), name: "Artist", wallet: "", percent: 50 },
    { id: genId(), name: "Producer", wallet: "", percent: 30 },
    { id: genId(), name: "Label", wallet: "", percent: 20 }
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", wallet: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [preset, setPreset] = useState("Music");

  const sum = Math.round(roles.reduce((s, r) => s + r.percent, 2) * 100) / 100;

  // For add role modal
  const handleAddRole = ({ name, wallet }: { name: string; wallet: string }) => {
    if (!name.trim()) return;
    if (roles.length > 8) return;
    const base = { id: genId(), name, wallet, percent: 10 };
    let next = roles.map(r => ({ ...r, percent: Math.round((r.percent / 100) * 90 * 10) / 10 }));
    next = [ ...next, base ];
    let sum = next.reduce((s, r) => s + r.percent, 0);
    if (Math.abs(sum - 100) > 0.1) next[0].percent += 100 - sum;
    setRolesWithHistory(next);
    setAddOpen(false);
  };

  const handleResize = (i: number, newValue: number) => {
    if (newValue < 1) newValue = 1;
    if (newValue > 100) newValue = 100;
    const next = proportionalRebalance(roles, i, newValue);
    setRolesWithHistory(next);
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

  // Remove role
  const handleRemove = (idx: number) => {
    if (roles.length === 1) return;
    const removedPercent = roles[idx].percent;
    const remainers = roles.filter((_, i) => i !== idx);
    const total = remainers.reduce((s, r) => s + r.percent, 0);
    const next = remainers.map(r =>
      ({ ...r, percent: Math.round((r.percent + (r.percent / total) * removedPercent) * 10) / 10 })
    );
    let sum = next.reduce((s, r) => s + r.percent, 0);
    if (Math.abs(sum - 100) > 0.01) next[0].percent += 100 - sum;
    setRolesWithHistory(next);
  };

  // Preset dropdown
  const handlePreset = (presetLabel: string) => {
    const p = PRESETS.find(t => t.label === presetLabel);
    if (p) {
      setPreset(p.label);
      setRolesWithHistory(p.roles.map(r => ({
        id: genId(),
        name: r.name,
        wallet: "",
        percent: r.percent
      })));
    }
  };

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
          <button className="border p-1 rounded hover:bg-border" onClick={undo} disabled={!canUndo}>
            <Undo size={16} />
          </button>
          <button className="border p-1 rounded hover:bg-border" onClick={redo} disabled={!canRedo}>
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
      <AddRoleModalStandalone
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddRole}
      />
    </div>
  );
};
