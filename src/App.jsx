import React, { useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Nav from './components/Nav';
import './App.css';
import ProductList from './components/ProductList';

function App() {
  const MainLayout = () => {
    return (
      <div>
        <Nav />
        <Outlet/>
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
      element: <MainLayout />,
      children: [
        {
          path: 'products',
          element: <ProductList />,
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
