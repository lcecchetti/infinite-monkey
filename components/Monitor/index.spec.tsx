import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useContext } from 'react';
import Monitor from '.';
import IsMonitorOnContext from '@/lib/is-monitor-on-context';

const ContextProbe = () => {
  const isMonitorOn = useContext(IsMonitorOnContext);
  return <span data-testid="probe">{String(isMonitorOn)}</span>;
};

describe('Monitor', () => {
  it('renders children inside the terminal output', () => {
    render(<Monitor><p>hello</p></Monitor>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('is in the "on" state once mounted on the client', () => {
    const { container } = render(<Monitor><p>hi</p></Monitor>);

    const monitor = container.firstChild as HTMLElement;
    expect(monitor.className).toMatch(/\b_on_/);
    expect(monitor.className).not.toMatch(/\b_off_/);
  });

  it('provides isMonitorOn=true via context once mounted', () => {
    render(<Monitor><ContextProbe /></Monitor>);

    expect(screen.getByTestId('probe')).toHaveTextContent('true');
  });
});
