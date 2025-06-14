
import React from "react";

interface AccentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  secondary?: boolean;
}
const AccentButton = React.forwardRef<HTMLButtonElement, AccentButtonProps>(
  ({ children, secondary = false, className = "", ...rest }, ref) => (
    <button
      ref={ref}
      className={`accent-btn ${secondary
          ? "bg-transparent border border-accent text-accent hover:bg-accent hover:text-white"
          : "bg-accent text-white"
        } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
);

AccentButton.displayName = "AccentButton";
export { AccentButton };
