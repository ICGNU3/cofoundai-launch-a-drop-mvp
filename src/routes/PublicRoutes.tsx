
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import HowItWorks from '@/pages/HowItWorks';
import NotFound from '@/pages/NotFound';

export const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
