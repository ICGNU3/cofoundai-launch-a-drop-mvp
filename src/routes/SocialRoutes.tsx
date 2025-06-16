
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FarcasterIntegration from '@/pages/FarcasterIntegration';
import FarcasterFramePage from '@/pages/FarcasterFramePage';

export const SocialRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/farcaster" element={<FarcasterIntegration />} />
      <Route path="/frame/:tokenAddress" element={<FarcasterFramePage />} />
    </Routes>
  );
};
