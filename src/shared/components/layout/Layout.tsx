/**
 * Main layout with Sidebar.
 * @module shared/components/layout/Layout
 */
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';

/**
 * Layout wrapping sidebar and content.
 * @returns {React.ReactElement} Element.
 */
export function Layout(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}