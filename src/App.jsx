import React, { useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Nav from './components/Nav';
import './App.css';
import ProductList from './components/ProductList';
import UserLists from './components/UserLists';

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
        },
        {
          path: 'users',
          element: <UserLists/>
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
