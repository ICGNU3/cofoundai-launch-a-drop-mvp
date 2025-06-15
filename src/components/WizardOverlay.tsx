
import React from "react";

export const WizardOverlay: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm transition">
    <div className="wizard-card w-[95vw] max-w-card mx-auto relative animate-fade-in shadow-lg">
      <button
        className="absolute top-3 right-4 text-body-text opacity-70 hover:opacity-100"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);
