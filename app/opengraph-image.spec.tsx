import { describe, expect, it } from 'vitest';
import { alt, contentType, size } from './opengraph-image';

describe('opengraph-image', () => {
  it('exposes the metadata Next.js reads to build the og:image tags', () => {
    expect(alt).toBe('Infinite Monkey Lab');
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe('image/png');
  });
});
