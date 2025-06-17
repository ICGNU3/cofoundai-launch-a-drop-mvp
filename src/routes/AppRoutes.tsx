
import React from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { TradingRoutes } from "./TradingRoutes";
import { SocialRoutes } from "./SocialRoutes";
import { DevTools } from "@/pages/DevTools";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Dashboard routes */}
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      
      {/* Trading routes */}
      <Route path="/trading/*" element={<TradingRoutes />} />
      
      {/* Social routes */}
      <Route path="/social/*" element={<SocialRoutes />} />
      
      {/* Development tools */}
      <Route path="/dev" element={<DevTools />} />
    </Routes>
  );
};
