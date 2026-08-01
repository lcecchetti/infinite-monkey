import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home, { metadata } from '@/app/page';

describe('Home', () => {
  it('renders the logo, theorem intro, and an idle monkey', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: 'Infinite Monkey LAB' })).toBeInTheDocument();
    expect(screen.getByText(/infinite monkey theorem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Execute Monkey Program' })).toBeInTheDocument();
  });

  it('exposes page metadata describing the theorem', () => {
    expect(metadata.title).toBe('Infinite Monkey Lab');
    expect(metadata.description).toMatch(/infinite monkey theorem/i);
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      title: 'Infinite Monkey Lab',
    });
  });
});
