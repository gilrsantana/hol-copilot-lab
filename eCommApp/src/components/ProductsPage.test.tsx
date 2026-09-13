import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { CartContext } from '../context/CartContext';
import ProductsPage from './ProductsPage';

vi.mock('./Header', () => ({ default: () => <div data-testid="header">Header</div> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));

const products = [
    {
        id: 'apple', name: 'Apple', price: 1.5, description: 'Crisp apple', image: 'apple.jpg', reviews: [], inStock: true
    },
    {
        id: 'pear', name: 'Pear', price: 2, description: 'Sweet pear', image: 'pear.jpg', reviews: [], inStock: false
    },
    { id: 'grapes', name: 'Grapes', price: 3, image: 'grapes.jpg', reviews: [], inStock: true },
    { id: 'orange', name: 'Orange', price: 2.5, image: 'orange.jpg', reviews: [], inStock: true }
];

const addToCart = vi.fn();
const renderProducts = () => render(
    <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
        <ProductsPage />
    </CartContext.Provider>
);

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn().mockImplementation((file: string) => Promise.resolve({
            ok: true,
            json: async () => file.includes('apple') ? products[0]
                : file.includes('pear') ? products[1]
                    : file.includes('grapes') ? products[2]
                        : products[3]
        })));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it('shows a loading state before products finish loading', () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise(() => undefined)));
        renderProducts();
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('loads products and supports adding in-stock products', async () => {
        renderProducts();
        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());

        expect(screen.getByText('Crisp apple')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
        fireEvent.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);
        expect(addToCart).toHaveBeenCalledWith(products[0]);
    });

    it('opens the review modal and submits a review', async () => {
        renderProducts();
        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());
        fireEvent.click(screen.getByRole('img', { name: 'Apple' }));

        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Jamie' } });
        fireEvent.change(screen.getByPlaceholderText('Your review'), { target: { value: 'Excellent' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('Excellent')).toBeInTheDocument();
    });

    it('stops loading when product requests fail', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network failure')));
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        renderProducts();

        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
