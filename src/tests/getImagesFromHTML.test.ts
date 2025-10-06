import { describe, it, expect } from 'vitest';
import { getImagesFromHTML } from '../crawl'

describe('getImagesFromHTML', () => {
  const baseURL = 'https://example.com';

  it('should extract a single absolute image URL from an img tag', () => {
    const html = '<img src="https://test.com/image.jpg" alt="Test image">';
    expect(getImagesFromHTML(html, baseURL)).toEqual(['https://test.com/image.jpg']);
  });

  it('should convert a relative image URL to absolute using baseURL', () => {
    const html = '<img src="/images/photo.png" alt="Photo">';
    expect(getImagesFromHTML(html, baseURL)).toEqual(['https://example.com/images/photo.png']);
  });

  it('should extract multiple image URLs from multiple img tags', () => {
    const html = `
      <img src="/img1.jpg" alt="Image 1">
      <img src="https://external.com/img2.png" alt="Image 2">
      <img src="./img3.gif" alt="Image 3">
    `;
    expect(getImagesFromHTML(html, baseURL)).toEqual([
      'https://example.com/img1.jpg',
      'https://external.com/img2.png',
      'https://example.com/img3.gif',
    ]);
  });

  it('should return an empty array when no img tags exist', () => {
    const html = '<p>No images here</p><div>Just text</div>';
    expect(getImagesFromHTML(html, baseURL)).toEqual([]);
  });

  it('should return an empty array for empty HTML input', () => {
    const html = '';
    expect(getImagesFromHTML(html, baseURL)).toEqual([]);
  });

  it('should ignore img tags without src attribute', () => {
    const html = '<img alt="No src"><img src="/valid.jpg" alt="Valid image">';
    expect(getImagesFromHTML(html, baseURL)).toEqual(['https://example.com/valid.jpg']);
  });

  // it('should handle malformed HTML gracefully', () => {
  //   const html = '<img src="/incomplete.jpg"';
  //   expect(getImagesFromHTML(html, baseURL)).toEqual(['https://example.com/incomplete.jpg']);
  // });

  it('should handle mixed case img tags and src attributes', () => {
    const html = '<IMG SRC="/uppercase.jpg" alt="Uppercase">';
    expect(getImagesFromHTML(html, baseURL)).toEqual(['https://example.com/uppercase.jpg']);
  });

  it('should decode HTML entities in src attributes', () => {
    const html = '<img src="/image?name=photo&amp;id=1.jpg" alt="Image">';
    expect(getImagesFromHTML(html, baseURL)).toEqual(['https://example.com/image?name=photo&id=1.jpg']);
  });

  it('should handle relative URLs with ../ notation', () => {
    const html = '<img src="../images/parent.jpg" alt="Parent image">';
    expect(getImagesFromHTML(html, baseURL)).toEqual(['https://example.com/images/parent.jpg']);
  });

  it('should throw an error for non-string HTML input', () => {
    expect(() => getImagesFromHTML(null as any, baseURL)).toThrow();
    expect(() => getImagesFromHTML(undefined as any, baseURL)).toThrow();
    expect(() => getImagesFromHTML(123 as any, baseURL)).toThrow();
  });

  it('should throw an error for non-string or invalid baseURL', () => {
    const html = '<img src="/image.jpg" alt="Image">';
    expect(() => getImagesFromHTML(html, null as any)).toThrow();
    expect(() => getImagesFromHTML(html, undefined as any)).toThrow();
    expect(() => getImagesFromHTML(html, '')).toThrow(); // Assuming empty baseURL is invalid
  });

  it('should handle baseURL with trailing slash correctly', () => {
    const html = '<img src="images/relative.jpg" alt="Image">';
    const baseWithSlash = 'https://example.com/';
    expect(getImagesFromHTML(html, baseWithSlash)).toEqual(['https://example.com/images/relative.jpg']);
  });

  it('should extract image URLs from complex HTML structure', () => {
    const html = `
      <div>
        <header><img src="/header.jpg" alt="Header image"></header>
        <main>
          <section>
            <img src="https://main.com/main.png" alt="Main image">
            <img src="./local.gif" alt="Local image">
          </section>
        </main>
      </div>
    `;
    expect(getImagesFromHTML(html, baseURL)).toEqual([
      'https://example.com/header.jpg',
      'https://main.com/main.png',
      'https://example.com/local.gif',
    ]);
  });

  it('should handle data URLs in src attributes', () => {
    const html = '<img src="data:image/png;base64,abc123" alt="Data image">';
    expect(getImagesFromHTML(html, baseURL)).toEqual(['data:image/png;base64,abc123']);
  });
});