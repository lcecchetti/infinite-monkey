import { describe, expect, it } from 'vitest';
import { ERASE_CHUNK, LINE_LENGTH, MonkeyState, monkeyActions, monkeyInitialState, monkeyReducer } from './useMonkey';
import { Quote } from './types';

describe('monkeyReducer', () => {
  it('WAKEUP resets essay and currentQuote, and wakes the monkey up', () => {
    const asleepMidEssay = {
      isAwake: false,
      essay: [{ value: 'a', isQuote: false }],
      currentQuote: { quote: '', author: 'A', work: 'W' },
      lineLength: 1,
      phase: 'typing' as const,
    };

    const next = monkeyReducer(asleepMidEssay, { type: monkeyActions.WAKEUP });

    expect(next.isAwake).toBe(true);
    expect(next.essay).toEqual([]);
    expect(next.currentQuote).toBeNull();
  });

  it('SLEEP only flips isAwake, preserving the essay and currentQuote so far', () => {
    const awake = {
      isAwake: true,
      essay: [{ value: 'a', isQuote: false }],
      currentQuote: { quote: 'remaining', author: 'A', work: 'W' },
      lineLength: 1,
      phase: 'typing' as const,
    };

    const next = monkeyReducer(awake, { type: monkeyActions.SLEEP });

    expect(next.isAwake).toBe(false);
    expect(next.essay).toBe(awake.essay);
    expect(next.currentQuote).toBe(awake.currentQuote);
  });

  it('DO appends a random alphabet char when literateRatio forces a typo', () => {
    const next = monkeyReducer(monkeyInitialState, {
      type: monkeyActions.DO,
      quotes: [],
      // Math.random() is always < 1, so a ratio of -1 always forces a typo
      literateRatio: -1,
      maxEssayLength: 100,
    });

    expect(next.essay).toHaveLength(1);
    expect(next.essay[0].isQuote).toBe(false);
    expect(next.currentQuote).toBeNull();
  });

  it('DO picks and types out a quote char by char, then keeps typing once exhausted', () => {
    const quotes: Quote[] = [{ quote: 'Hi there', author: 'A', work: 'W' }];
    // a ratio > 1 means Math.random() > literateRatio is always false, forcing quote mode
    const doAction = { type: monkeyActions.DO, quotes, literateRatio: 2, maxEssayLength: 100 } as const;

    let state = monkeyInitialState;
    for (let i = 0; i < 'Hi there'.length; i++) {
      state = monkeyReducer(state, doAction);
    }

    expect(state.essay.map((char) => char.value).join('')).toBe('Hi there');
    expect(state.essay.every((char) => char.isQuote)).toBe(true);
    expect(state.currentQuote).toEqual({ quote: '', author: 'A', work: 'W' });

    // once the quote is exhausted, currentQuote is kept (not reset to null) but
    // the monkey goes back to typing randomly rather than picking a new quote
    state = monkeyReducer(state, doAction);
    expect(state.currentQuote?.quote).toBe('');
    expect(state.essay.at(-1)?.isQuote).toBe(false);
  });

  it('DO wraps to a new line every LINE_LENGTH characters', () => {
    const doAction = { type: monkeyActions.DO, quotes: [] as Quote[], literateRatio: -1, maxEssayLength: 10_000 };

    let state = monkeyInitialState;
    for (let i = 0; i < LINE_LENGTH; i++) {
      state = monkeyReducer(state, doAction);
    }

    expect(state.essay).toHaveLength(LINE_LENGTH + 1);
    expect(state.essay.at(-1)?.value).toBe('\n');
    expect(state.lineLength).toBe(0);
  });

  it('DO wipes a full page with no quote: switches to erasing, keeping the full page for that tick', () => {
    const maxLines = 1;
    const doAction = {
      type: monkeyActions.DO,
      quotes: [] as Quote[],
      literateRatio: -1,
      maxEssayLength: LINE_LENGTH * maxLines,
    };

    let state = monkeyInitialState;
    for (let i = 0; i < LINE_LENGTH; i++) {
      state = monkeyReducer(state, doAction);
    }

    expect(state.phase).toBe('erasing');
    expect(state.isAwake).toBe(monkeyInitialState.isAwake);
    expect(state.essay).toHaveLength(LINE_LENGTH + 1);
  });

  it('ERASE removes a chunk at a time, then resumes typing on an empty page', () => {
    const fullLine = Array.from({ length: ERASE_CHUNK + 5 }, () => ({ value: 'a', isQuote: false }));
    let state: MonkeyState = { ...monkeyInitialState, essay: fullLine, phase: 'erasing' };

    state = monkeyReducer(state, { type: monkeyActions.ERASE });
    expect(state.essay).toHaveLength(5);
    expect(state.phase).toBe('erasing');

    state = monkeyReducer(state, { type: monkeyActions.ERASE });
    expect(state.essay).toEqual([]);
    expect(state.phase).toBe('typing');
    expect(state.lineLength).toBe(0);
  });

  it('DO ends the run (as if stopped by hand) when a quote finishes right as the page fills', () => {
    const maxLines = 1;
    const quotes: Quote[] = [{ quote: 'hi', author: 'A', work: 'W' }];
    // ratio > 1 forces quote mode as soon as a quote is picked
    const doAction = { type: monkeyActions.DO, quotes, literateRatio: 2, maxEssayLength: LINE_LENGTH * maxLines };

    // fill the page with typos up to the last slot, then let the 2-char
    // quote finish exactly as the page fills
    let state = { ...monkeyInitialState, isAwake: true };
    for (let i = 0; i < LINE_LENGTH - 2; i++) {
      state = monkeyReducer(state, { ...doAction, literateRatio: -1 });
    }

    state = monkeyReducer(state, doAction);
    state = monkeyReducer(state, doAction);

    expect(state.isAwake).toBe(false);
    expect(state.phase).toBe('typing');
    expect(state.currentQuote).toEqual({ quote: '', author: 'A', work: 'W' });
    expect(state.essay).toHaveLength(LINE_LENGTH + 1);
  });

  it('DO lets an in-progress quote overflow past the page limit instead of cutting it short', () => {
    const maxLines = 1;
    // 8 chars, short enough that getRandomQuotePart passes it through unchanged
    const quotes: Quote[] = [{ quote: 'Hi there', author: 'A', work: 'W' }];
    const typoAction = { type: monkeyActions.DO, quotes, literateRatio: -1, maxEssayLength: LINE_LENGTH * maxLines };
    const quoteAction = { type: monkeyActions.DO, quotes, literateRatio: 2, maxEssayLength: LINE_LENGTH * maxLines };

    let state = { ...monkeyInitialState, isAwake: true };

    // fill the line with typos, leaving room for the quote to start but not finish before it wraps
    for (let i = 0; i < LINE_LENGTH - 3; i++) {
      state = monkeyReducer(state, typoAction);
    }

    // type the quote's first 2 chars - still on the first line
    state = monkeyReducer(state, quoteAction);
    state = monkeyReducer(state, quoteAction);
    expect(state.isAwake).toBe(true);

    // the 3rd char wraps to a new line mid-quote: the page is technically
    // over its line limit here, but the quote isn't done, so it must continue
    state = monkeyReducer(state, quoteAction);
    expect(state.isAwake).toBe(true);
    expect(state.phase).toBe('typing');
    const lineCountMidQuote = state.essay.filter((char) => char.value === '\n').length + 1;
    expect(lineCountMidQuote).toBeGreaterThan(maxLines);

    // finish the remaining 5 chars of the quote
    for (let i = 0; i < 5; i++) {
      state = monkeyReducer(state, quoteAction);
    }

    // now that the quote is done, the overdue page limit finally ends the run
    expect(state.isAwake).toBe(false);
    expect(state.currentQuote).toEqual({ quote: '', author: 'A', work: 'W' });
  });
});
