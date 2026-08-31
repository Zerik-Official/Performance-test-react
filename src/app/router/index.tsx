/**
 * App router.
 * @module app/router
 */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@shared/components/layout/Layout';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { RoleGuard } from './guards/RoleGuard';
import { GuestGuard } from './guards/GuestGuard';
import { Home } from '@features/home/pages/Home';
import { Login } from '@features/auth/pages/Login';
import { Register } from '@features/auth/pages/Register';
import { Profile } from '@features/profile/pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestGuard>
        <Register />
      </GuestGuard>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'favorites', element: <div className="p-8">Favorites - In development</div> },
      { path: 'categories', element: <div className="p-8">Categories - In development</div> },
      { path: 'products', element: <div className="p-8">Products - In development</div> },
      { path: 'admin/categories/new', element: <RoleGuard role="admin"><div className="p-8">Create Category - Admin only</div></RoleGuard> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);