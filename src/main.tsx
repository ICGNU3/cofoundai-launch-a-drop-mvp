import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * Polyfill for Node.js 'global' variable, required for some browserified dependencies.
 * This fixes 'global is not defined' errors in packages like @safe-global/safe-ethers-lib.
 */
(window as any).global = window;

createRoot(document.getElementById("root")!).render(<App />);
