
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TradingHub from '@/pages/TradingHub';

export const TradingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/trading" element={<TradingHub />} />
    </Routes>
  );
};
