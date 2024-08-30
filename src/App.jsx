import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Nav from './components/Nav';
import './App.css';

function App() {
  const MainLayout = () => {
    return (
      <div>
        <Nav />
      </div>
    );
  }
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    }, 
    {
      path: '/dashboard',
      element: <MainLayout />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
