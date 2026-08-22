import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Coupon } from '../../services/couponService';

describe('CouponFormModal', () => {
  afterEach(() => {
    cleanup();
  });

  it('explicitly clears old limited-time dates when changed to a normal coupon', async () => {
    const { default: CouponFormModal } = await import('../CouponFormModal');
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const coupon: Coupon = {
      id: 42,
      merchant_id: 7,
      store_id: 9,
      title: 'Dinner deal',
      description: '',
      image_url: '',
      type: 'percentage',
      coupon_type: 'limited_time',
      original_price: 20,
      sale_price: 15,
      discount_percentage: 25,
      dish_ids: '[]',
      total_quantity: 100,
      claimed_count: 0,
      max_per_user: 1,
      valid_from: '2026-08-22T17:00:00Z',
      valid_until: '2026-08-22T22:00:00Z',
      status: 'active',
    };

    render(
      <CouponFormModal
        isOpen
        coupon={coupon}
        dishes={[]}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Normal Coupon' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save as Draft' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.clear_valid_from).toBe(true);
    expect(payload.clear_valid_until).toBe(true);
    expect(payload).not.toHaveProperty('valid_from');
    expect(payload).not.toHaveProperty('valid_until');
  });
});
