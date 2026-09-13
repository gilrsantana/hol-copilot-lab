import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 1.5,
    reviews: [{ author: 'Sam', comment: 'Fresh fruit', date: '2025-01-02T00:00:00.000Z' }],
    inStock: true
};

describe('ReviewModal', () => {
    it('renders nothing when no product is selected', () => {
        const { container } = render(<ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders existing reviews and submits a new review', () => {
        const onSubmit = vi.fn();
        render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={onSubmit} />);

        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        expect(screen.getByText('Sam')).toBeInTheDocument();
        expect(screen.getByText('Fresh fruit')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Alex' } });
        fireEvent.change(screen.getByPlaceholderText('Your review'), { target: { value: 'Great apple' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
            author: 'Alex',
            comment: 'Great apple',
            date: expect.any(String)
        }));
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
    });

    it('shows the empty state and closes from the backdrop or button', () => {
        const onClose = vi.fn();
        const emptyProduct = { ...product, reviews: [] };
        const { container } = render(<ReviewModal product={emptyProduct} onClose={onClose} onSubmit={vi.fn()} />);

        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        fireEvent.click(container.querySelector('.modal-backdrop')!);
        expect(onClose).toHaveBeenCalledTimes(2);
    });
});
