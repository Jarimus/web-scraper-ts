import { getH1FromHTML } from '../crawl'
import { describe, it, expect } from 'vitest'

describe('getH1FromHTML', () => {
  // Test 1: Basic case with a single h1 tag
  it('should return the text content of a single h1 tag', () => {
    const html = '<h1>Hello, World!</h1>';
    expect(getH1FromHTML(html)).toBe('Hello, World!');
  });

  // Test 2: Multiple h1 tags, should return the first one
  it('should return the text content of the first h1 tag when multiple h1 tags exist', () => {
    const html = '<h1>First Heading</h1><h1>Second Heading</h1>';
    expect(getH1FromHTML(html)).toBe('First Heading');
  });

  // Test 3: No h1 tag in the HTML
  it('should return an empty string when no h1 tag is present', () => {
    const html = '<div>No heading here</div><p>Just a paragraph</p>';
    expect(getH1FromHTML(html)).toBe('');
  });

  // Test 4: Empty HTML string
  it('should return an empty string for an empty HTML input', () => {
    const html = '';
    expect(getH1FromHTML(html)).toBe('');
  });

  // Test 5: h1 tag with nested elements
  it('should return the full text content of an h1 tag with nested elements', () => {
    const html = '<h1>Welcome to <span>my</span> site</h1>';
    expect(getH1FromHTML(html)).toBe('Welcome to my site');
  });

  // Test 6: h1 tag with attributes
  it('should ignore attributes and return only the text content', () => {
    const html = '<h1 class="title" id="main-heading">Styled Heading</h1>';
    expect(getH1FromHTML(html)).toBe('Styled Heading');
  });

  // Test 7: Malformed HTML with incomplete h1 tag
  it('should handle malformed HTML gracefully', () => {
    const html = '<h1>Unclosed heading';
    expect(getH1FromHTML(html)).toBe('Unclosed heading');
  });

  // Test 8: HTML with mixed case tags
  it('should handle mixed case h1 tags', () => {
    const html = '<H1>Mixed Case Heading</H1>';
    expect(getH1FromHTML(html)).toBe('Mixed Case Heading');
  });

  // Test 9: h1 tag with only whitespace
  it('should return trimmed text for h1 with only whitespace', () => {
    const html = '<h1>   </h1>';
    expect(getH1FromHTML(html)).toBe('');
  });

  // Test 10: Non-string input
  it('should throw an error for non-string input', () => {
    // Assuming the function throws an error for invalid input
    expect(() => getH1FromHTML(null as any)).toThrow();
    expect(() => getH1FromHTML(undefined as any)).toThrow();
    expect(() => getH1FromHTML(123 as any)).toThrow();
  });

  // Test 11: h1 tag with encoded characters
  it('should decode HTML entities in h1 text', () => {
    const html = '<h1>Hello &amp; World!</h1>';
    expect(getH1FromHTML(html)).toBe('Hello & World!');
  });

  // Test 12: Complex HTML with h1 in the middle
  it('should find h1 tag within complex HTML structure', () => {
    const html = `
      <div>
        <p>Some text</p>
        <h1>Main Title</h1>
        <section>
          <h2>Subtitle</h2>
        </section>
      </div>
    `;
    expect(getH1FromHTML(html)).toBe('Main Title');
  });
});