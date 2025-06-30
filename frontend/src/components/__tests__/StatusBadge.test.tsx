
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders pass status correctly', () => {
    render(<StatusBadge status="pass">PASSED</StatusBadge>);
    
    const badge = screen.getByText('PASSED');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-pass');
  });

  it('renders fail status correctly', () => {
    render(<StatusBadge status="fail">FAILED</StatusBadge>);
    
    const badge = screen.getByText('FAILED');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-fail');
  });

  it('renders warning status correctly', () => {
    render(<StatusBadge status="warning">WARNING</StatusBadge>);
    
    const badge = screen.getByText('WARNING');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-warning');
  });

  it('renders pending status correctly', () => {
    render(<StatusBadge status="pending">PENDING</StatusBadge>);
    
    const badge = screen.getByText('PENDING');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-gray-400');
  });
});
