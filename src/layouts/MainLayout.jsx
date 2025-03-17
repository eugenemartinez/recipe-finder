import React from 'react';
import NavBar from '../components/common/NavBar';

const MainLayout = ({ children }) => (
  <div className="min-h-screen w-full bg-[#3D405B] overflow-x-hidden">
    <NavBar />
    <main className="w-full">
      <div className="w-full max-w-6xl mx-auto px-4">
        {children}
      </div>
    </main>
  </div>
);

export default MainLayout;