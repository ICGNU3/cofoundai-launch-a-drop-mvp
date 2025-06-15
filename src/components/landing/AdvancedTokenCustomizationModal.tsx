
import React from "react";
import AdvancedTokenCustomization from "@/components/AdvancedTokenCustomization/AdvancedTokenCustomization";

type Props = {
  isOpen: boolean,
  onClose: () => void
};

const AdvancedTokenCustomizationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-2xl">
        <div className="absolute top-3 right-3 z-50">
          <button
            onClick={onClose}
            className="bg-card text-body-text/70 rounded-full p-1 border border-border shadow hover:text-accent"
            aria-label="Close"
          >✕</button>
        </div>
        <div className="bg-surface border border-border rounded-xl shadow-2xl p-4 overflow-y-auto max-h-[90vh]">
          <AdvancedTokenCustomization />
        </div>
      </div>
    </div>
  );
};

export default AdvancedTokenCustomizationModal;
