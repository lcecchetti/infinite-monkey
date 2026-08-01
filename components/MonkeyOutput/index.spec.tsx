import { act, render, screen } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MonkeyOutput from '.';
import IsMonitorOnContext from 'lib/is-monitor-on-context';
import { Quote } from 'lib/types';
import { LINE_LENGTH } from 'lib/use-monkey';

// MonkeyOutput only runs while its ancestor Monitor is "on" (see the
// monitor-off auto-sleep effect); tests exercising the running monkey need
// that context explicitly set to true since the default is false.
const renderMonitorOn = (ui: ReactElement) => {
  return render(<IsMonitorOnContext.Provider value={true}>{ui}</IsMonitorOnContext.Provider>);
};

describe('MonkeyOutput', () => {
  let scrollIntoViewMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock as unknown as typeof Element.prototype.scrollIntoView;
    vi.stubGlobal('Audio', vi.fn().mockImplementation(function (this: { loop: boolean; play: () => void; pause: () => void }) {
      this.loop = false;
      this.play = vi.fn();
      this.pause = vi.fn();
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const tick = () => act(() => vi.runOnlyPendingTimers());
  const click = () => act(() => screen.getByRole('button').click());

  it('toggles the button label between execute and stop', () => {
    renderMonitorOn(<MonkeyOutput quotes={[]} literateRatio={0.5} maxEssayLength={600} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Execute Monkey Program');

    click();
    expect(button).toHaveTextContent('Stop The Monkey');

    click();
    expect(button).toHaveTextContent('Execute Monkey Program');
  });

  it('renders typed characters, highlighting the ones that are part of a quote', () => {
    // a quote no longer than MIN_QUOTE_LENGTH is typed out unchanged and deterministically
    const quotes: Quote[] = [{ quote: 'HelloWorld', author: 'A', work: 'W' }];
    renderMonitorOn(<MonkeyOutput quotes={quotes} literateRatio={2} maxEssayLength={600} />);

    click();
    for (let i = 0; i < 'HelloWorld'.length; i++) {
      tick();
    }

    const essayChars = screen.getByText('H').parentElement!.querySelectorAll('span');
    expect(Array.from(essayChars).map((span) => span.textContent).join('')).toBe('HelloWorld');
    expect(Array.from(essayChars).every((span) => span.className.match(/_highlight_/))).toBe(true);
  });

  it('shows the moral message once the run ends after quoting', () => {
    // "HelloWorld" (10 chars) is typed unchanged, then the rest of the 60-char
    // line is typos; wrapping the line after the quote finished ends the run
    const quotes: Quote[] = [{ quote: 'HelloWorld', author: 'Author Name', work: 'Some Work' }];
    renderMonitorOn(<MonkeyOutput quotes={quotes} literateRatio={2} maxEssayLength={LINE_LENGTH} />);

    click();
    for (let i = 0; i < LINE_LENGTH; i++) {
      tick();
    }

    expect(screen.getByRole('button')).toHaveTextContent('Execute Monkey Program');
    expect(screen.getByText(/Some Work by Author Name/)).toBeInTheDocument();
  });

  it('scrolls the first quote character into view as soon as a quote is found', () => {
    const quotes: Quote[] = [{ quote: 'HelloWorld', author: 'A', work: 'W' }];
    renderMonitorOn(<MonkeyOutput quotes={quotes} literateRatio={2} maxEssayLength={600} />);

    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    click();
    tick();

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
  });

  it('stops the monkey automatically once the monitor turns off', () => {
    render(
      <IsMonitorOnContext.Provider value={false}>
        <MonkeyOutput quotes={[]} literateRatio={0.5} maxEssayLength={600} />
      </IsMonitorOnContext.Provider>
    );

    click();

    expect(screen.getByRole('button')).toHaveTextContent('Execute Monkey Program');
  });

  it('hides the rapidly-typed essay from assistive tech', () => {
    const quotes: Quote[] = [{ quote: 'HelloWorld', author: 'A', work: 'W' }];
    renderMonitorOn(<MonkeyOutput quotes={quotes} literateRatio={2} maxEssayLength={600} />);

    click();
    tick();

    const essayContainer = screen.getByText('H').parentElement!;
    expect(essayContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('announces start and stop through a status region instead of the essay', () => {
    renderMonitorOn(<MonkeyOutput quotes={[]} literateRatio={0} maxEssayLength={600} />);

    const status = screen.getAllByRole('status')[0];
    expect(status).toHaveTextContent('');

    click();
    expect(status).toHaveTextContent('The monkey started typing.');

    tick();
    click();
    expect(status).toHaveTextContent('The monkey stopped.');
  });

  it('announces the moral message through a status region once a quote is found', () => {
    const quotes: Quote[] = [{ quote: 'HelloWorld', author: 'Author Name', work: 'Some Work' }];
    renderMonitorOn(<MonkeyOutput quotes={quotes} literateRatio={2} maxEssayLength={LINE_LENGTH} />);

    click();
    for (let i = 0; i < LINE_LENGTH; i++) {
      tick();
    }

    const statusRegions = screen.getAllByRole('status');
    const moralStatus = statusRegions.find((region) => region.textContent?.includes('Some Work'));
    expect(moralStatus).toBeDefined();
  });
});
