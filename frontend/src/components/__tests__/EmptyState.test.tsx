
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders no-results state correctly', () => {
    render(
      <EmptyState
        type="no-results"
        title="No results found"
        description="Try adjusting your search criteria"
      />
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
  });

  it('renders network-error state correctly', () => {
    render(
      <EmptyState
        type="network-error"
        title="Connection failed"
        description="Please check your internet connection"
      />
    );

    expect(screen.getByText('Connection failed')).toBeInTheDocument();
    expect(screen.getByText('Please check your internet connection')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    
    render(
      <EmptyState
        type="network-error"
        title="Error"
        description="Something went wrong"
        onRetry={mockRetry}
        retryText="Try Again"
      />
    );

    const retryButton = screen.getByRole('button', { name: 'Try Again' });
    expect(retryButton).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockRetry = vi.fn();
    
    render(
      <EmptyState
        type="network-error"
        title="Error"
        description="Something went wrong"
        onRetry={mockRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: 'Try again' });
    await user.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(
      <EmptyState
        type="no-results"
        title="No results"
        description="No data available"
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
