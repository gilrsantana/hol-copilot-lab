import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import CheckoutModal from './CheckoutModal';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Header', () => {
    it('renders the store title and navigation links', () => {
        renderWithRouter(<Header />);
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
        expect(screen.getByRole('button', { name: 'Contact Us' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Admin Login' })).toBeInTheDocument();
    });

    it('opens the contact form modal', () => {
        renderWithRouter(<Header />);
        fireEvent.click(screen.getByRole('button', { name: 'Contact Us' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Request')).toBeInTheDocument();
    });
});

describe('Footer', () => {
    it('renders the copyright notice', () => {
        render(<Footer />);
        expect(screen.getByText(/The Daily Harvest/)).toBeInTheDocument();
    });
});

describe('HomePage', () => {
    it('renders the welcome content', () => {
        renderWithRouter(<HomePage />);
        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
        expect(screen.getByText(/Check out our products page/)).toBeInTheDocument();
    });
});

describe('CheckoutModal', () => {
    it('calls the confirmation and cancellation handlers', () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);

        fireEvent.click(screen.getByRole('button', { name: 'Continue Checkout' }));
        fireEvent.click(screen.getByRole('button', { name: 'Return to cart' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
