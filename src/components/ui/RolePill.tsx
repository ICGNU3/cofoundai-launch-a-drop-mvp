
import React, { useState } from "react";
import { Edit, X } from "lucide-react";

export type RolePillProps = {
  role: { roleName: string, percent: number; };
  onEdit?: () => void;
  onDelete?: () => void;
  onPercentChange?: (newPercent: number) => void;
};

export const RolePill: React.FC<RolePillProps> = ({ role, onEdit, onDelete, onPercentChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [percentStr, setPercentStr] = useState(role.percent.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    // Allow empty or numeric digits only
    if (v === '' || /^\d{0,3}$/.test(v)) {
      setPercentStr(v);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(percentStr, 10);
    const final = isNaN(parsed) ? 0 : Math.min(parsed, 100);
    
    // Update the role's percent if we have a callback
    if (onPercentChange) {
      onPercentChange(final);
    }
    
    // Sync string state
    setPercentStr(final.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setPercentStr(role.percent.toString());
      setIsEditing(false);
    }
  };

  // Sync with role prop changes
  React.useEffect(() => {
    setPercentStr(role.percent.toString());
  }, [role.percent]);

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
          value={percentStr}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="ml-1 w-12 bg-transparent border-none outline-none font-mono tracking-tight text-center"
          autoFocus
        />
      ) : (
        <span 
          className="ml-1 font-mono tracking-tight cursor-pointer hover:bg-accent/10 px-1 rounded"
          onClick={() => setIsEditing(true)}
        >
          {role.percent}%
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
