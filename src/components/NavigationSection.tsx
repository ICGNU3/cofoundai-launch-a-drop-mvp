
import React from "react";
import { Link } from "react-router-dom";

export const NavigationSection = () => (
  <div className="flex gap-4">
    <Link
      to="/dashboard"
      className="px-6 py-3 bg-accent/20 text-accent border border-accent rounded-lg hover:bg-accent/30 transition"
    >
      ← Back to Dashboard
    </Link>
    <Link
      to="/"
      className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition"
    >
      Launch New Drop
    </Link>
    <Link
      to="/workspace/demo-project-id"
      className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-700 transition"
    >
      Try Collaborative Workspace
    </Link>
  </div>
);
