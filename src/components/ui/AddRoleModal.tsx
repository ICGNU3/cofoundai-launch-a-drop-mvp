
import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Textarea } from "../ui/textarea";

interface AddRoleModalProps {
  open: boolean;
  defaultRole?: {
    roleName: string;
    walletAddress: string;
    percent: number;
    description?: string;
    skills?: string[];
  };
  onClose: () => void;
  onSave: (role: {
    roleName: string;
    walletAddress: string;
    percent: number;
    description?: string;
    skills?: string[];
  }) => void;
  existingRoles: { roleName: string; percent: number }[];
}

const ALL_SKILLS = [
  "Solidity Development",
  "Frontend",
  "UI/UX Design",
  "Marketing",
  "Content Writing",
  "Community Management",
  "Project Management",
  "Music Production",
  "Film Editing",
  "Legal",
  "Governance",
  "Visual Art",
  "NFTs",
  "DevOps"
];

function uniqTags(a: string[]): string[] {
  return Array.from(new Set(a.map(s => s.trim()).filter(Boolean)));
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
  const [description, setDescription] = useState(defaultRole?.description || "");
  const [skills, setSkills] = useState<string[]>(defaultRole?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRoleName(defaultRole?.roleName || "");
    setWalletAddress(defaultRole?.walletAddress || "");
    setPercentStr(
      defaultRole && typeof defaultRole.percent === "number"
        ? defaultRole.percent.toString()
        : ""
    );
    setDescription(defaultRole?.description || "");
    setSkills(defaultRole?.skills || []);
    setSkillInput("");
    setError(null);
  }, [open, defaultRole]);

  function handleSave() {
    if (!roleName.trim()) return setError("Role name required");
    if (!walletAddress.trim()) return setError("Wallet address required");
    let percent = percentStr === "" ? 0 : Number(percentStr);
    if (Number.isNaN(percent) || percent < 0 || percent > 100) return setError("Percent must be 0–100");
    onSave({
      roleName: roleName.trim(),
      walletAddress: walletAddress.trim(),
      percent,
      description: description.trim(),
      skills: uniqTags(skills)
    });
  }

  function addSkillTag(tag: string) {
    if (!tag) return;
    setSkills(uniqTags([...skills, tag]));
    setSkillInput("");
  }
  function removeSkillTag(tag: string) {
    setSkills(skills.filter(s => s !== tag));
  }
  function handleSkillInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSkillInput(e.target.value);
  }
  function handleSkillInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      addSkillTag(skillInput.trim());
    }
    // quick-select first suggestion w/Tab
    if (e.key === "Tab" && skillInput.trim()) {
      e.preventDefault();
      const match = ALL_SKILLS.find(s =>
        s.toLowerCase().startsWith(skillInput.toLowerCase())
      );
      if (match) {
        addSkillTag(match);
      } else {
        addSkillTag(skillInput.trim());
      }
    }
  }

  const skillSuggestions = skillInput
    ? ALL_SKILLS.filter(
        s =>
          s.toLowerCase().includes(skillInput.toLowerCase()) &&
          !skills.includes(s)
      )
    : ALL_SKILLS.filter(s => !skills.includes(s));

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-xs relative">
        <button className="absolute right-2 top-2 text-lg" onClick={onClose}>&times;</button>
        <h3 className="font-bold mb-2">Add/Edit Role</h3>
        <Input
          className="w-full mb-2"
          placeholder="Role Name (e.g. Producer)"
          value={roleName}
          onChange={e => setRoleName(e.target.value)}
        />
        <Input
          className="w-full mb-2"
          placeholder="Wallet Address (0x…)"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
        />
        <Input
          className="w-full mb-2"
          type="number"
          min={0}
          max={100}
          placeholder="Percent"
          value={percentStr}
          onChange={e => {
            const v = e.target.value;
            if (v === "" || (/^\d{0,3}$/.test(v) && Number(v) >= 0 && Number(v) <= 100)) {
              setPercentStr(v);
            }
          }}
          onFocus={() => setPercentStr(percentStr === "0" ? "" : percentStr)}
        />
        <Textarea
          className="w-full mb-2"
          placeholder="Describe role responsibilities, deliverables, expectations…"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />
        {/* Skill tag input */}
        <div className="mb-2">
          <div className="font-medium text-xs mb-1">Skills</div>
          <div className="flex flex-wrap gap-2 mb-1">
            {skills.map(skill => (
              <span key={skill} className="bg-accent/20 border border-accent text-accent rounded px-2 py-0.5 text-xs flex items-center">
                {skill}
                <button type="button" className="ml-1 text-[11px] hover:text-red-400" onClick={() => removeSkillTag(skill)}>×</button>
              </span>
            ))}
          </div>
          <Input
            className="mb-1"
            placeholder="Type and press Enter…"
            value={skillInput}
            onChange={handleSkillInputChange}
            onKeyDown={handleSkillInputKeyDown}
            list="all-skills-suggestions"
          />
          <datalist id="all-skills-suggestions">
            {skillSuggestions.map(s => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <div className="text-xs text-zinc-500">e.g. Solidity, UI/UX, Content Writing…</div>
        </div>
        {error && <div className="text-red-500 text-[13px] mb-1">{error}</div>}
        <button className="accent-btn w-full mt-2" onClick={handleSave}>Save Role</button>
      </div>
    </div>
  );
};
