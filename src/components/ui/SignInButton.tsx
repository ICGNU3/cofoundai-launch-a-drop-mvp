
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./button";

const SignInButton: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // This component is deprecated - use AuthButton instead
  if (isAuthenticated) return null;

  return null;
};

export default SignInButton;
