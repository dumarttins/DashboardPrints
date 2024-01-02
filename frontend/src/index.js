import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 1 - Configurando router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './Componentes/Login/Login';
import Dashboard from './Componentes/Dashboard/Dashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/Login",
    element: <Login/>
  },
  {
    path: "/Dashboard",
    element: <Dashboard/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
