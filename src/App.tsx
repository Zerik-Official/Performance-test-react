/**
 * Root App component.
 * @module App
 */
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { AppProviders } from './app/providers/AppProviders';

/**
 * App entry point.
 * @returns {React.ReactElement} Element.
 */
export default function App(): React.ReactElement {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}