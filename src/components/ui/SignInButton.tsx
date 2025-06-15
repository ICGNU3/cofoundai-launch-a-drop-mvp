
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./button";

const SignInButton: React.FC = () => {
  const { authenticated, login } = usePrivy();

  if (authenticated) return null;

  return (
    <Button
      className="fixed top-5 right-6 z-30 bg-accent text-white shadow-lg rounded-md px-5 py-2 font-semibold transition hover:scale-105 hover:bg-accent/80"
      onClick={login}
      style={{ background: "linear-gradient(92deg, #36DF8C 9%, #8399FF 52%, #FFD700 98%)" }}
      aria-label="Sign In"
    >
      Sign In
    </Button>
  );
};

export default SignInButton;
