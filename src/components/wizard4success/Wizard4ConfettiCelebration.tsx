
import React from "react";
import Confetti from "react-confetti";

interface Wizard4ConfettiCelebrationProps {
  show: boolean;
}

export const Wizard4ConfettiCelebration: React.FC<Wizard4ConfettiCelebrationProps> = ({ show }) =>
  show ? (
    <Confetti
      width={typeof window !== "undefined" ? window.innerWidth : 600}
      height={typeof window !== "undefined" ? window.innerHeight : 400}
      numberOfPieces={220}
      recycle={false}
      gravity={0.24}
    />
  ) : null;
