import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

vi.mock('./Header', () => ({ default: () => <div data-testid="header">Header</div> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));

describe('AdminPage', () => {
    it('starts with no sale active', () => {
        render(<MemoryRouter><AdminPage /></MemoryRouter>);
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('applies a valid sale percentage', () => {
        render(<MemoryRouter><AdminPage /></MemoryRouter>);
        const input = screen.getByLabelText(/Set Sale Percent/);

        fireEvent.change(input, { target: { value: '25' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('shows an error for invalid sale input', () => {
        render(<MemoryRouter><AdminPage /></MemoryRouter>);
        const input = screen.getByLabelText(/Set Sale Percent/);

        fireEvent.change(input, { target: { value: 'not-a-number' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
    });

    it('ends an active sale and resets the input', () => {
        render(<MemoryRouter><AdminPage /></MemoryRouter>);
        const input = screen.getByLabelText(/Set Sale Percent/);

        fireEvent.change(input, { target: { value: '10' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        fireEvent.click(screen.getByRole('button', { name: 'End Sale' }));

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(input).toHaveValue('0');
    });
});
