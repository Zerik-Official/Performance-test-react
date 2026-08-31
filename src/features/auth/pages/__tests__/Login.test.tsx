// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Login } from '../Login';
import { AuthProvider } from '@shared/context/AuthContext';

describe('Login Integration Test', () => {
  it('renders login form elements and allows typing credentials', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email|correo/i);
    const passwordInput = screen.getByPlaceholderText(/password|contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|login|entrar/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    await userEvent.type(emailInput, 'admin@examen.com');
    await userEvent.type(passwordInput, 'Admin123!');

    expect(emailInput).toHaveValue('admin@examen.com');
    expect(passwordInput).toHaveValue('Admin123!');
  });
});