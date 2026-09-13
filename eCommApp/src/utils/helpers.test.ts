import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('helpers', () => {
    it('formats prices as USD currency', () => {
        expect(formatPrice(29.99)).toBe('$29.99');
        expect(formatPrice(1000)).toBe('$1,000.00');
    });

    it('calculates the total for cart items', () => {
        expect(calculateTotal([
            { price: 10, quantity: 2 },
            { price: 4.5, quantity: 3 }
        ])).toBe(33.5);
    });

    it('returns zero for an empty cart', () => {
        expect(calculateTotal([])).toBe(0);
    });

    it('validates email addresses', () => {
        expect(validateEmail('customer@example.com')).toBe(true);
        expect(validateEmail('invalid-email')).toBe(false);
        expect(validateEmail('missing@domain')).toBe(false);
    });
});
