import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: mockCartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

const renderWithCartContext = (cartContext = mockCartContext) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays cart items when cart has items', () => {
        renderWithCartContext();
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('displays an empty-cart message when the cart has no items', () => {
        renderWithCartContext({
            ...mockCartContext,
            cartItems: []
        });

        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
    });

    it('opens and cancels the checkout modal', () => {
        renderWithCartContext();

        fireEvent.click(screen.getByRole('button', { name: 'Checkout' }));

        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('cancel-checkout'));

        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });

    it('confirms checkout and displays the processed order', () => {
        renderWithCartContext();

        fireEvent.click(screen.getByRole('button', { name: 'Checkout' }));
        fireEvent.click(screen.getByTestId('confirm-checkout'));

        expect(mockCartContext.clearCart).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    it('throws when rendered without a CartContext provider', () => {
        expect(() =>
            render(
                <CartContext.Provider value={undefined}>
                    <CartPage />
                </CartContext.Provider>
            )
        ).toThrow('CartContext must be used within a CartProvider');
    });
});
