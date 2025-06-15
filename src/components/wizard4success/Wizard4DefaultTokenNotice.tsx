
import React from "react";

export const Wizard4DefaultTokenNotice: React.FC = () => (
  <div className="bg-yellow-100 dark:bg-yellow-900/15 rounded px-3 py-2 text-sm text-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-800 mb-3 mt-1 flex items-center gap-2">
    <span className="font-semibold text-gold">Note:</span>
    This drop will use the <b>default token name</b>{" "}
    <span className="font-mono px-1 bg-black/10 rounded">Drop</span> and <b>symbol</b>{" "}
    <span className="font-mono px-1 bg-black/10 rounded">DROP</span>.
  </div>
);
