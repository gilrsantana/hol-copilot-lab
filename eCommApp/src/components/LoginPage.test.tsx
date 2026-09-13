import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';

vi.mock('./Header', () => ({ default: () => <div data-testid="header">Header</div> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));

const Location = () => <span data-testid="location">{useLocation().pathname}</span>;

const renderLogin = () => render(
    <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
        <Location />
    </MemoryRouter>
);

describe('LoginPage', () => {
    it('shows an error for invalid credentials', () => {
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        expect(screen.getByTestId('location')).toHaveTextContent('/login');
    });

    it('navigates to the admin page with valid credentials', () => {
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'admin' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByTestId('location')).toHaveTextContent('/admin');
        expect(screen.getByPlaceholderText('Username')).toHaveValue('');
        expect(screen.getByPlaceholderText('Password')).toHaveValue('');
    });
});
