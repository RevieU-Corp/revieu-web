import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet, mockPatch } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPatch: vi.fn(),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
    patch: mockPatch,
  },
}));

vi.mock('../../../shared/components/InteractiveMap', () => ({
  default: () => <div data-testid="interactive-map" />,
}));

vi.mock('../../../shared/components/ConfirmationDialog', () => ({
  default: ({
    isOpen,
    onConfirm,
    onClose,
    title,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
    title: string;
  }) =>
    isOpen ? (
      <div>
        <p>{title}</p>
        <button type="button" onClick={onConfirm}>
          Confirm
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock('../../../shared/components/MenuItemModal', () => ({
  default: () => null,
}));

describe('StoreProfile', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPatch.mockReset();

    mockGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 320,
            name: 'Northline Brunch Club - North Beach',
            phone: '(415) 555-3401',
            website: 'https://demo.revieu.local/northline/north',
            address: '1800 Stockton St',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            latitude: 37.8032,
            longitude: -122.4091,
            cover_image_url: 'https://cdn.revieu.com/store-cover.jpg',
            images: '[]',
            menu_images:
              '["https://cdn.revieu.com/menu-1.jpg","https://cdn.revieu.com/menu-2.jpg"]',
            description: 'Brunch flagship.',
          },
        ],
      },
    });
    mockPatch.mockResolvedValue({
      data: {
        data: {
          id: 320,
          name: 'Northline Brunch Club - North Beach',
          phone: '(415) 555-3401',
          website: 'https://demo.revieu.local/northline/north',
          address: '1800 Stockton St',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          latitude: 37.8032,
          longitude: -122.4091,
          cover_image_url: 'https://cdn.revieu.com/store-cover.jpg',
          images: '[]',
          menu_images: '["https://cdn.revieu.com/menu-2.jpg"]',
          description: 'Brunch flagship.',
        },
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('loads the first merchant store and renders its uploaded menu images', async () => {
    const { default: StoreProfile } = await import('../StoreProfile');

    render(<StoreProfile />);

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/merchant/stores?limit=1');
    });

    expect(await screen.findAllByText('Northline Brunch Club - North Beach')).toHaveLength(2);
    expect(screen.getByAltText('Menu 1')).toHaveAttribute('src', 'https://cdn.revieu.com/menu-1.jpg');
    expect(screen.getByAltText('Menu 2')).toHaveAttribute('src', 'https://cdn.revieu.com/menu-2.jpg');
    expect(screen.queryByText('McDonald\'s - USC Figueroa')).not.toBeInTheDocument();
  });

  it('persists menu image changes back to the owned store', async () => {
    const { default: StoreProfile } = await import('../StoreProfile');

    render(<StoreProfile />);

    expect(await screen.findAllByText('Northline Brunch Club - North Beach')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    fireEvent.click(screen.getAllByTitle('Delete menu image')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith('/merchant/stores/320', expect.objectContaining({
        menu_images: ['https://cdn.revieu.com/menu-2.jpg'],
      }));
    });
  });
});
