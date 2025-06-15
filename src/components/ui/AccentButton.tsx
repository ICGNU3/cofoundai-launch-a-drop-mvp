
import React from "react";
import { motion } from "framer-motion";

interface AccentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  secondary?: boolean;
}

const AccentButton = React.forwardRef<HTMLButtonElement, AccentButtonProps>(
  ({ children, secondary = false, className = "", ...rest }, ref) => {
    // Separate HTML button props from potential Framer Motion conflicts
    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onDragEnter,
      onDragExit,
      onDragLeave,
      onDragOver,
      onDrop,
      ...buttonProps
    } = rest;

    return (
      <motion.button
        ref={ref}
        className={`accent-btn ${secondary
            ? "bg-transparent border border-accent text-accent hover:bg-accent hover:text-white"
            : "bg-accent text-white"
          } ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15, ease: [0.23, 1.03, 0.65, 1.19] }}
        {...buttonProps}
      >
        {children}
      </motion.button>
    );
  }
);

AccentButton.displayName = "AccentButton";
export { AccentButton };
