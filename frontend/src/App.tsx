import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Home } from '@/pages/Home';
import { RepositoryDashboard } from '@/pages/RepositoryDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="repository/:id" element={<RepositoryDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
