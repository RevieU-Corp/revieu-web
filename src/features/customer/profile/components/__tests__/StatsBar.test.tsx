import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import StatsBar from '../StatsBar';

describe('StatsBar', () => {
  it('shows REVIEWS and FOLLOWING buttons only', () => {
    render(
      <StatsBar
        stats={{
          totalReviews: 142,
          photosUploaded: 856,
          helpfulVotes: 4205,
          views: '2.4M',
          following: 318,
        }}
      />
    );

    expect(screen.getByRole('button', { name: /reviews/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
    expect(screen.queryByText(/photos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\bviews\b/i)).not.toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('318')).toBeInTheDocument();
  });
});
