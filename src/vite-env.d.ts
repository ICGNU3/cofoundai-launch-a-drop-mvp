
/// <reference types="vite/client" />

// Add global declarations for CountUp.js and Canvas-Confetti
interface Window {
  CountUp?: any;
  confetti?: (...args: any[]) => void;
}
