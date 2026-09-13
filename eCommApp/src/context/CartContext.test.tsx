import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { Product } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 1.5,
    image: 'apple.jpg',
    reviews: [],
    inStock: true
};

describe('CartProvider', () => {
    it('adds new products and increments existing quantities', () => {
        const Consumer = () => {
            const context = React.useContext(CartContext);
            if (!context) throw new Error('Missing cart context');
            return (
                <>
                    <span data-testid="count">{context.cartItems.length}</span>
                    <span data-testid="quantity">{context.cartItems[0]?.quantity ?? 0}</span>
                    <button onClick={() => context.addToCart(product)}>Add</button>
                </>
            );
        };

        render(<CartProvider><Consumer /></CartProvider>);
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        expect(screen.getByTestId('count')).toHaveTextContent('1');
        expect(screen.getByTestId('quantity')).toHaveTextContent('2');
    });

    it('clears all products', () => {
        const Consumer = () => {
            const context = React.useContext(CartContext);
            if (!context) throw new Error('Missing cart context');
            return (
                <>
                    <span data-testid="count">{context.cartItems.length}</span>
                    <button onClick={() => context.addToCart(product)}>Add</button>
                    <button onClick={context.clearCart}>Clear</button>
                </>
            );
        };

        render(<CartProvider><Consumer /></CartProvider>);
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

        expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
});
