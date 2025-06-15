
import React, { useState } from "react";
import { Edit, X } from "lucide-react";

export type RolePillProps = {
  role: { roleName: string, percent: number; percentNum: number; percentStr: string; };
  onEdit?: () => void;
  onDelete?: () => void;
  onPercentChange?: (newPercent: number) => void;
};

export const RolePill: React.FC<RolePillProps> = ({ role, onEdit, onDelete, onPercentChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPercentStr, setTempPercentStr] = useState(role.percentStr || role.percentNum.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    // Allow empty or numeric digits only (up to 3 digits)
    if (v === '' || /^\d{0,3}$/.test(v)) {
      setTempPercentStr(v);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(tempPercentStr, 10);
    const final = isNaN(parsed) || tempPercentStr === '' ? 0 : Math.max(0, Math.min(parsed, 100));
    
    // Update the role's percent if we have a callback
    if (onPercentChange) {
      onPercentChange(final);
    }
    
    // Sync string state with final value
    setTempPercentStr(final.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setTempPercentStr(role.percentStr || role.percentNum.toString());
      setIsEditing(false);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    setTempPercentStr(role.percentStr || role.percentNum.toString());
  };

  // Sync with role prop changes when not editing
  React.useEffect(() => {
    if (!isEditing) {
      setTempPercentStr(role.percentStr || role.percentNum.toString());
    }
  }, [role.percentStr, role.percentNum, isEditing]);

  return (
    <span
      className="inline-flex items-center role-pill cursor-default select-none border border-accent bg-[#18181a] px-2 py-1 rounded text-[15px]"
      tabIndex={-1}
      aria-label={`Role: ${role.roleName}`}
    >
      <span className="font-medium">{role.roleName}</span>
      {isEditing ? (
        <input
          type="text"
          value={tempPercentStr}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="ml-1 w-12 bg-transparent border-none outline-none font-mono tracking-tight text-center"
          autoFocus
          placeholder="0"
        />
      ) : (
        <span 
          className="ml-1 font-mono tracking-tight cursor-pointer hover:bg-accent/10 px-1 rounded"
          onClick={handleFocus}
        >
          {role.percentNum || 0}%
        </span>
      )}
      {onEdit && (
        <button
          className="ml-2 text-accent hover:bg-accent/10 p-1 rounded focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          aria-label={`Edit ${role.roleName}`}
          tabIndex={0}
          type="button"
          onClick={e => { e.stopPropagation(); onEdit(); }}
        >
          <Edit size={16} />
        </button>
      )}
      {onDelete && (
        <button
          className="ml-1 text-red-400 hover:bg-red-400/10 p-1 rounded focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
          aria-label={`Remove ${role.roleName}`}
          tabIndex={0}
          type="button"
          onClick={e => { e.stopPropagation(); onDelete(); }}
        >
          <X size={16} />
        </button>
      )}
    </span>
  );
};
