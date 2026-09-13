import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ContactPage from './ContactPage';

describe('ContactPage', () => {
    it('submits the form, clears its entries, and shows the confirmation', () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>,
        );

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alex' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alex@example.com' } });
        fireEvent.change(screen.getByLabelText('Request'), { target: { value: 'Help with an order' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Thank you for your message.')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
        fireEvent.click(screen.getByRole('button', { name: 'Contact Us' }));
        expect(screen.getByLabelText('Name')).toHaveValue('');
        expect(screen.getByLabelText('Email')).toHaveValue('');
        expect(screen.getByLabelText('Request')).toHaveValue('');
    });

    it('closes the confirmation when Continue is clicked', () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>,
        );

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alex' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alex@example.com' } });
        fireEvent.change(screen.getByLabelText('Request'), { target: { value: 'Help' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});