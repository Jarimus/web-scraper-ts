import { describe, it, expect } from 'vitest';
import { getFirstParagraphFromHTML } from '../crawl'; // Adjust the import based on your file structure

describe('getFirstParagraphFromHTML', () => {
  it('should return the text content of a single p tag', () => {
    const html = '<p>This is a paragraph.</p>';
    expect(getFirstParagraphFromHTML(html)).toBe('This is a paragraph.');
  });

  it('should return the text content of the first p tag when multiple p tags exist', () => {
    const html = '<p>First paragraph</p><p>Second paragraph</p>';
    expect(getFirstParagraphFromHTML(html)).toBe('First paragraph');
  });

  it('should return an empty string when no p tag is present', () => {
    const html = '<div>No paragraph here</div><h1>Just a heading</h1>';
    expect(getFirstParagraphFromHTML(html)).toBe('');
  });

  it('should return an empty string for an empty HTML input', () => {
    const html = '';
    expect(getFirstParagraphFromHTML(html)).toBe('');
  });

  it('should return the full text content of a p tag with nested elements', () => {
    const html = '<p>Welcome to <span>my</span> website</p>';
    expect(getFirstParagraphFromHTML(html)).toBe('Welcome to my website');
  });

  it('should ignore attributes and return only the text content', () => {
    const html = '<p class="intro" id="first-para">Introduction text</p>';
    expect(getFirstParagraphFromHTML(html)).toBe('Introduction text');
  });

  it('should handle malformed HTML gracefully', () => {
    const html = '<p>Unclosed paragraph';
    expect(getFirstParagraphFromHTML(html)).toBe('Unclosed paragraph');
  });

  it('should handle mixed case p tags', () => {
    const html = '<P>Mixed Case Paragraph</P>';
    expect(getFirstParagraphFromHTML(html)).toBe('Mixed Case Paragraph');
  });

  it('should return trimmed text for p tag with only whitespace', () => {
    const html = '<p>   </p>';
    expect(getFirstParagraphFromHTML(html)).toBe('');
  });

  it('should throw an error for non-string input', () => {
    expect(() => getFirstParagraphFromHTML(null as any)).toThrow();
    expect(() => getFirstParagraphFromHTML(undefined as any)).toThrow();
    expect(() => getFirstParagraphFromHTML(123 as any)).toThrow();
  });

  it('should decode HTML entities in p text', () => {
    const html = '<p>Hello &amp; Welcome!</p>';
    expect(getFirstParagraphFromHTML(html)).toBe('Hello & Welcome!');
  });

  it('should find p tag within complex HTML structure', () => {
    const html = `
      <div>
        <h1>Title</h1>
        <p>Main content here</p>
        <section>
          <p>Another paragraph</p>
        </section>
      </div>
    `;
    expect(getFirstParagraphFromHTML(html)).toBe('Main content here');
  });

  // Additional Test 1: Prefer first p in <main> when <p> exists outside
  it('should prefer the first p tag inside <main> over p tags outside', () => {
    const html = `
      <header><p>Header paragraph (should be ignored)</p></header>
      <main><p>Main content paragraph</p></main>
      <footer><p>Footer paragraph (should be ignored)</p></footer>
    `;
    expect(getFirstParagraphFromHTML(html)).toBe('Main content paragraph');
  });

  // Additional Test 2: Multiple p in <main>, return the first one in <main>
  it('should return the first p tag inside <main> when multiple exist in <main>', () => {
    const html = `
      <header><p>Header paragraph</p></header>
      <main>
        <p>First main paragraph</p>
        <p>Second main paragraph</p>
      </main>
    `;
    expect(getFirstParagraphFromHTML(html)).toBe('First main paragraph');
  });

  // Additional Test 3: No p in <main>, but p elsewhere, return outside p
  it('should return outside <p> if <main> exists but has no p tags', () => {
    const html = `
      <header><p>Header paragraph</p></header>
      <main><div>No paragraph here</div></main>
      <footer><p>Footer paragraph</p></footer>
    `;
    expect(getFirstParagraphFromHTML(html)).toBe('Header paragraph');
  });

  // Additional Test 4: No <main>, fall back to first p in document
  it('should fall back to the first p tag in the document if no <main> exists', () => {
    const html = `
      <div><p>First paragraph</p></div>
      <p>Second paragraph</p>
    `;
    expect(getFirstParagraphFromHTML(html)).toBe('First paragraph');
  });

  // Additional Test 5: Nested <main>, prefer first p in outermost <main>
  it('should handle nested <main> tags and prefer the first p in the outermost <main>', () => {
    const html = `
      <main>
        <p>Outer main paragraph</p>
        <main><p>Nested main paragraph</p></main>
      </main>
    `;
    expect(getFirstParagraphFromHTML(html)).toBe('Outer main paragraph');
  });

  // Additional Test 6: <main> with nested elements and p
  it('should find the first p inside <main> with nested structures', () => {
    const html = `
      <p>Outside paragraph</p>
      <main>
        <section>
          <article>
            <p>Deeply nested main paragraph</p>
          </article>
        </section>
      </main>
    `;
    expect(getFirstParagraphFromHTML(html)).toBe('Deeply nested main paragraph');
  });
});