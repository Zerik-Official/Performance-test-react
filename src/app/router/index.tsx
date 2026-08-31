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
import { ViewCategories } from '@/features/categories/pages/ViewCategory';
import { CreateCategories } from '@/features/categories/pages/CreateCategory';
import { Events } from '@/features/events/pages/Events';
import { ViewFavorites } from '@/features/favorites/pages/Favorites';
import { CreateEvents } from '@/features/events/pages/CreateEvents';

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
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'categories', element: <ViewCategories /> },
      { path: 'events', element: <Events /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <ViewFavorites />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/categories/new',
        element: (
          <ProtectedRoute>
            <RoleGuard role="admin">
              <div className="p-8">
                <CreateCategories />
              </div>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/events/new',
        element: (
          <ProtectedRoute>
            <RoleGuard role="admin">
              <div className="p-8">
                <CreateEvents />
              </div>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);