import { describe, it, expect } from 'vitest';
import { getURLsFromHTML } from '../crawl'

describe('getURLsFromHTML', () => {
  const baseURL = 'https://example.com';

  it('should extract a single absolute URL from an anchor tag', () => {
    const html = '<a href="https://test.com">Link</a>';
    expect(getURLsFromHTML(html, baseURL)).toEqual(['https://test.com/']);
  });

  it('should convert a relative URL to absolute using baseURL', () => {
    const html = '<a href="/path/to/page">Link</a>';
    expect(getURLsFromHTML(html, baseURL)).toEqual(['https://example.com/path/to/page']);
  });

  it('should extract multiple URLs from multiple anchor tags', () => {
    const html = `
      <a href="/page1">Link 1</a>
      <a href="https://external.com">Link 2</a>
      <a href="./page2">Link 3</a>
    `;
    expect(getURLsFromHTML(html, baseURL)).toEqual([
      'https://example.com/page1',
      'https://external.com/',
      'https://example.com/page2',
    ]);
  });

  it('should return an empty array when no anchor tags exist', () => {
    const html = '<p>No links here</p><div>Just text</div>';
    expect(getURLsFromHTML(html, baseURL)).toEqual([]);
  });

  it('should return an empty array for empty HTML input', () => {
    const html = '';
    expect(getURLsFromHTML(html, baseURL)).toEqual([]);
  });

  it('should ignore anchor tags without href attribute', () => {
    const html = '<a>Link without href</a><a href="/valid">Valid Link</a>';
    expect(getURLsFromHTML(html, baseURL)).toEqual(['https://example.com/valid']);
  });

  // it('should handle malformed HTML gracefully', () => {
  //   const html = '<a href="/incomplete>Unclosed link</a>';
  //   expect(getURLsFromHTML(html, baseURL)).toEqual(['https://example.com/incomplete']);
  // });

  it('should handle mixed case anchor tags', () => {
    const html = '<A HREF="/uppercase">Uppercase Link</A>';
    expect(getURLsFromHTML(html, baseURL)).toEqual(['https://example.com/uppercase']);
  });

  it('should decode HTML entities in href attributes', () => {
    const html = '<a href="/path?name=value&amp;id=1">Link</a>';
    expect(getURLsFromHTML(html, baseURL)).toEqual(['https://example.com/path?name=value&id=1']);
  });

  it('should handle relative URLs with ../ notation', () => {
    const html = '<a href="../parent/page">Link</a>';
    expect(getURLsFromHTML(html, baseURL)).toEqual(['https://example.com/parent/page']);
  });

  it('should throw an error for non-string HTML input', () => {
    expect(() => getURLsFromHTML(null as any, baseURL)).toThrow();
    expect(() => getURLsFromHTML(undefined as any, baseURL)).toThrow();
    expect(() => getURLsFromHTML(123 as any, baseURL)).toThrow();
  });

  it('should throw an error for non-string or invalid baseURL', () => {
    const html = '<a href="/path">Link</a>';
    expect(() => getURLsFromHTML(html, null as any)).toThrow();
    expect(() => getURLsFromHTML(html, undefined as any)).toThrow();
    expect(() => getURLsFromHTML(html, '')).toThrow(); // Assuming empty baseURL is invalid
  });

  it('should handle baseURL with trailing slash correctly', () => {
    const html = '<a href="relative/path">Link</a>';
    const baseWithSlash = 'https://example.com/';
    expect(getURLsFromHTML(html, baseWithSlash)).toEqual(['https://example.com/relative/path']);
  });

  it('should extract URLs from complex HTML structure', () => {
    const html = `
      <div>
        <header><a href="/header">Header Link</a></header>
        <main>
          <section>
            <a href="https://main.com">Main Link</a>
            <a href="./local">Local Link</a>
          </section>
        </main>
      </div>
    `;
    expect(getURLsFromHTML(html, baseURL)).toEqual([
      'https://example.com/header',
      'https://main.com/',
      'https://example.com/local',
    ]);
  });

  it('should handle fragment URLs correctly', () => {
    const html = '<a href="#section1">Fragment Link</a>';
    expect(getURLsFromHTML(html, baseURL)).toEqual(['https://example.com/#section1']);
  });
});