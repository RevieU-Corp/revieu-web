import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CouponCard from '../CouponCard';

const coupon = {
  id: 'voucher-1',
  businessName: 'Revieu Demo Cafe',
  offerTitle: 'Free Welcome Drink',
  expiryDate: 'Expires Sep 24',
  code: 'REV-1',
  status: 'active' as const,
  logo: 'https://example.com/logo.png',
  color: '#990000',
};

describe('CouponCard', () => {
  it('keeps the card and explains a failed delete', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockRejectedValue(new Error('request failed'));

    render(<CouponCard coupon={coupon} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'Delete coupon' }));

    expect(onDelete).toHaveBeenCalledWith('voucher-1');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to remove this coupon. Please try again.'
    );
    expect(screen.getByText('Free Welcome Drink')).toBeInTheDocument();
  });
});
