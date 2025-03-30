import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard.tsx';
import DataSets from '../pages/DataSets.tsx';
import Analysis from '../pages/Analysis.tsx';
import Settings from '../pages/Settings.tsx';
import Login from '../pages/Login.tsx';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'datasets',
        element: <DataSets />,
      },
      {
        path: 'analysis',
        element: <Analysis />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);