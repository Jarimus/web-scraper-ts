import { describe, it, expect } from 'vitest'
import { normalizeURL } from './crawl'

describe('normalizeURL', () => {
  it('should normalize URL with mixed case to lowercase', () => {
    const input = 'HTTPS://EXAMPLE.COM/PATH';
    const expected = 'https://example.com/path';
    expect(normalizeURL(input)).toBe(expected);
  });

  it('should remove query parameters', () => {
    const input = 'https://example.com/path?a=1&b=2';
    const expected = 'https://example.com/path';
    expect(normalizeURL(input)).toBe(expected);
  });

  it('should remove hash fragments', () => {
    const input = 'https://example.com/path#section';
    const expected = 'https://example.com/path';
    expect(normalizeURL(input)).toBe(expected);
  });

  it('should remove trailing slash', () => {
    const input = 'https://example.com/path/';
    const expected = 'https://example.com/path';
    expect(normalizeURL(input)).toBe(expected);
  });

  it('should remove ports', () => {
    const input = 'http://example.com:8080/path';
    const expected = 'http://example.com/path';
    expect(normalizeURL(input)).toBe(expected);
  });

  it('should handle invalid URLs by throwing an error', () => {
    const input = 'not-a-valid-url';
    expect(() => normalizeURL(input)).toThrow('Invalid URL');
  });

  it('should handle empty string input by throwing an error', () => {
    const input = '';
    expect(() => normalizeURL(input)).toThrow('Invalid URL');
  });

});