import { describe, it, expect } from 'vitest';
import { extractPageData } from '../data_handling'

describe('extractPageData', () => {
  it('should extract basic page data correctly', () => {
    const inputURL = 'https://blog.boot.dev';
    const inputBody = `
      <html><body>
        <h1>Test Title</h1>
        <p>This is the first paragraph.</p>
        <a href="/link1">Link 1</a>
        <img src="/image1.jpg" alt="Image 1">
      </body></html>
    `;
    const actual = extractPageData(inputBody, inputURL);
    const expected = {
      url: 'https://blog.boot.dev',
      h1: 'Test Title',
      first_paragraph: 'This is the first paragraph.',
      outgoing_links: ['https://blog.boot.dev/link1'],
      image_urls: ['https://blog.boot.dev/image1.jpg'],
    };
    expect(actual).toEqual(expected);
  });

  it('should handle complex HTML with main section precedence for paragraph', () => {
    const inputURL = 'https://example.com';
    const inputBody = `
      <html><body>
        <header>
          <h1>Main Title</h1>
          <p>Header paragraph (ignored)</p>
        </header>
        <main>
          <p>Main paragraph</p>
          <p>Second main paragraph</p>
          <a href="/internal">Internal Link</a>
          <a href="https://external.com">External Link</a>
          <img src="./main.jpg" alt="Main image">
        </main>
        <footer>
          <p>Footer paragraph (ignored)</p>
          <img src="/footer.png" alt="Footer image">
        </footer>
      </body></html>
    `;
    const actual = extractPageData(inputBody, inputURL);
    const expected = {
      url: 'https://example.com',
      h1: 'Main Title',
      first_paragraph: 'Main paragraph',
      outgoing_links: ['https://example.com/internal', 'https://external.com/'],
      image_urls: ['https://example.com/main.jpg', 'https://example.com/footer.png'],
    };
    expect(actual).toEqual(expected);
  });

  it('should return empty strings and arrays for HTML with no relevant tags', () => {
    const inputURL = 'https://example.com';
    const inputBody = '<html><body><div>No content here</div></body></html>';
    const actual = extractPageData(inputBody, inputURL);
    const expected = {
      url: 'https://example.com',
      h1: '',
      first_paragraph: '',
      outgoing_links: [],
      image_urls: [],
    };
    expect(actual).toEqual(expected);
  });

  it('should handle empty HTML input', () => {
    const inputURL = 'https://example.com';
    const inputBody = '';
    const actual = extractPageData(inputBody, inputURL);
    const expected = {
      url: 'https://example.com',
      h1: '',
      first_paragraph: '',
      outgoing_links: [],
      image_urls: [],
    };
    expect(actual).toEqual(expected);
  });

  it('should throw an error for non-string HTML or pageURL', () => {
    const validHTML = '<h1>Title</h1>';
    const validURL = 'https://example.com';
    expect(() => extractPageData(null as any, validURL)).toThrow();
    expect(() => extractPageData(undefined as any, validURL)).toThrow();
    expect(() => extractPageData(123 as any, validURL)).toThrow();
    expect(() => extractPageData(validHTML, null as any)).toThrow();
    expect(() => extractPageData(validHTML, undefined as any)).toThrow();
  });

  it('should handle relative URLs with complex paths and HTML entities', () => {
    const inputURL = 'https://example.com/subfolder/';
    const inputBody = `
      <html><body>
        <h1>Complex Title</h1>
        <p>Main &amp; Content</p>
        <a href="../link1">Link 1</a>
        <a href="/link2?name=value&amp;id=1">Link 2</a>
        <img src="./images/photo.jpg" alt="Photo">
        <img src="data:image/png;base64,abc123" alt="Data image">
      </body></html>
    `;
    const actual = extractPageData(inputBody, inputURL);
    const expected = {
      url: 'https://example.com/subfolder/',
      h1: 'Complex Title',
      first_paragraph: 'Main & Content',
      outgoing_links: ['https://example.com/link1', 'https://example.com/link2?name=value&id=1'],
      image_urls: ['https://example.com/subfolder/images/photo.jpg', 'data:image/png;base64,abc123'],
    };
    expect(actual).toEqual(expected);
  });

  it('should handle no main section by falling back to first paragraph', () => {
    const inputURL = 'https://example.com';
    const inputBody = `
      <html><body>
        <h1>Fallback Title</h1>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <a href="/link">Link</a>
        <img src="/image.jpg" alt="Image">
      </body></html>
    `;
    const actual = extractPageData(inputBody, inputURL);
    const expected = {
      url: 'https://example.com',
      h1: 'Fallback Title',
      first_paragraph: 'First paragraph',
      outgoing_links: ['https://example.com/link'],
      image_urls: ['https://example.com/image.jpg'],
    };
    expect(actual).toEqual(expected);
  });

  it('should handle empty main section with paragraphs outside', () => {
    const inputURL = 'https://example.com';
    const inputBody = `
      <html><body>
        <h1>Title</h1>
        <p>Outside paragraph</p>
        <main><div>No paragraphs here</div></main>
        <a href="/link">Link</a>
        <img src="/image.jpg" alt="Image">
      </body></html>
    `;
    const actual = extractPageData(inputBody, inputURL);
    const expected = {
      url: 'https://example.com',
      h1: 'Title',
      first_paragraph: 'Outside paragraph',
      outgoing_links: ['https://example.com/link'],
      image_urls: ['https://example.com/image.jpg'],
    };
    expect(actual).toEqual(expected);
  });

  it('should handle mixed case tags and attributes', () => {
    const inputURL = 'https://example.com';
    const inputBody = `
      <html><body>
        <H1>Mixed Case Title</H1>
        <MAIN><P>Mixed Case Paragraph</P></MAIN>
        <A HREF="/link">Link</A>
        <IMG SRC="/image.jpg" ALT="Image">
      </body></html>
    `;
    const actual = extractPageData(inputBody, inputURL);
    const expected = {
      url: 'https://example.com',
      h1: 'Mixed Case Title',
      first_paragraph: 'Mixed Case Paragraph',
      outgoing_links: ['https://example.com/link'],
      image_urls: ['https://example.com/image.jpg'],
    };
    expect(actual).toEqual(expected);
  });
});