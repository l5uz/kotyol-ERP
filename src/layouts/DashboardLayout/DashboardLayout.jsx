import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const DashboardLayout = () => {
  return (
    <div className="d-flex min-vh-100 bg-body-custom">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1 min-vw-0">
        <Navbar />
        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
