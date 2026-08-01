import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useMonkey, { ERASE_SPEED } from '@/lib/use-monkey';
import { Quote } from '@/lib/types';

describe('useMonkey', () => {
  let playMock: ReturnType<typeof vi.fn>;
  let pauseMock: ReturnType<typeof vi.fn>;
  let AudioMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();

    playMock = vi.fn();
    pauseMock = vi.fn();
    AudioMock = vi.fn().mockImplementation(function (this: { loop: boolean; play: typeof playMock; pause: typeof pauseMock }) {
      this.loop = false;
      this.play = playMock;
      this.pause = pauseMock;
    });
    vi.stubGlobal('Audio', AudioMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('starts asleep with an empty essay', () => {
    const { result } = renderHook(() => useMonkey([], 0, 100));

    expect(result.current.monkey.isAwake).toBe(false);
    expect(result.current.monkey.essay).toEqual([]);
    expect(AudioMock).not.toHaveBeenCalled();
  });

  it('wakeUp wakes the monkey and starts typing on a timer', () => {
    const { result } = renderHook(() => useMonkey([], -1, 10_000));

    act(() => result.current.wakeUp());
    expect(result.current.monkey.isAwake).toBe(true);
    expect(result.current.monkey.essay).toHaveLength(0);

    act(() => vi.runOnlyPendingTimers());
    expect(result.current.monkey.essay).toHaveLength(1);

    act(() => vi.runOnlyPendingTimers());
    expect(result.current.monkey.essay).toHaveLength(2);
  });

  it('sleep stops the typing loop', () => {
    const { result } = renderHook(() => useMonkey([], -1, 10_000));

    act(() => result.current.wakeUp());
    act(() => vi.runOnlyPendingTimers());
    const lengthAtSleep = result.current.monkey.essay.length;

    act(() => result.current.sleep());
    expect(result.current.monkey.isAwake).toBe(false);

    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current.monkey.essay).toHaveLength(lengthAtSleep);
  });

  it('lazily creates a single Audio instance the first time the monkey wakes up', () => {
    const { result } = renderHook(() => useMonkey([], -1, 10_000));

    expect(AudioMock).not.toHaveBeenCalled();

    act(() => result.current.wakeUp());
    expect(AudioMock).toHaveBeenCalledTimes(1);
    expect(AudioMock).toHaveBeenCalledWith('/audio/keyboard.mp3');

    act(() => result.current.sleep());
    act(() => result.current.wakeUp());
    expect(AudioMock).toHaveBeenCalledTimes(1);
  });

  it('plays the sound effect while typing and pauses it once asleep', () => {
    const { result } = renderHook(() => useMonkey([], -1, 10_000));

    act(() => result.current.wakeUp());
    expect(playMock).toHaveBeenCalledTimes(1);
    expect(pauseMock).not.toHaveBeenCalled();

    act(() => result.current.sleep());
    expect(pauseMock).toHaveBeenCalledTimes(1);
  });

  it('pauses the sound effect while erasing a full page', () => {
    const quotes: Quote[] = [];
    // maxEssayLength of 1 line means the page fills almost immediately with typos
    const { result } = renderHook(() => useMonkey(quotes, -1, 60));

    act(() => result.current.wakeUp());
    expect(playMock).toHaveBeenCalledTimes(1);

    // type past the page limit to trigger the erasing phase
    for (let i = 0; i < 60; i++) {
      act(() => vi.runOnlyPendingTimers());
    }

    expect(result.current.monkey.phase).toBe('erasing');
    expect(pauseMock).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(ERASE_SPEED));
    expect(result.current.monkey.essay.length).toBeLessThan(60);
  });
});
