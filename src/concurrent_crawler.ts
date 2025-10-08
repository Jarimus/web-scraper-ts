import pLimit, { LimitFunction } from 'p-limit'
import { URL } from "node:url"
import { ExtractedPageData, extractPageData, getURLsFromHTML, normalizeURL } from "./data_handling"

class ConcurrentCrawler {
  baseUrl: string
  pages: Record<string, ExtractedPageData>
  limit: LimitFunction
  shouldStop: boolean
  maxPages: number

  constructor(baseUrl: string, limit: number, maxPages: number) {
    this.baseUrl = baseUrl
    this.pages = {}
    this.maxPages = Math.max(1, maxPages)
    this.limit = pLimit(limit)
    this.shouldStop = false
  }

  private async addPageVisit(normalizedURL: string): Promise<boolean> {
    if (this.shouldStop) {
      return false
    }
    if (Object.keys(this.pages).length >= this.maxPages) {
      this.shouldStop = true
      console.log('Reached maximum number of pages to crawl.')
      return false
    }
    if (this.pages[normalizedURL]) {
      this.pages[normalizedURL].visits++
      return false
    }
    return true
  }

  private async getHTML(url: string): Promise<string> {
    return await this.limit(async () => {
      if (this.shouldStop) {
        return ""
      }

      const res = await fetch(url, {
        headers: {'User-Agent': 'BootCrawler/1.0'}
      })
      if (!res.ok) {
        throw new Error(`Error status: ${res.status}`)
      }
      const type = res.headers.get('Content-Type')
      if (!type || !type.includes('text/html')) {
        throw new Error(`Page "${url}" is not text/html: ${type}`)
      }
      return await res.text()
    })
  }

  private async crawlPage(currentURL: string): Promise<void> {
    // Stay within the same domain. Do not crawl further.
    const baseURLobj = new URL(this.baseUrl)
    const currentURLobj = new URL(currentURL)
    if (baseURLobj.origin !== currentURLobj.origin) {
      return
    }
    // Check with the normalized URL whether the page has been visited already.
    // Only increment if it has been visited before.
    const normalizedCurrentURL = normalizeURL(currentURL)
    const isNewPage = await this.addPageVisit(normalizedCurrentURL)
    if (!isNewPage) {
      return
    }
    // get HTML for current URL
    console.log(`Getting html for ${currentURL}`)
    let html = ""
    try {
      html = await this.getHTML(currentURL)
    } catch(error) {
      if (this.pages[normalizedCurrentURL]) {
        this.pages[normalizedCurrentURL].visits++
      } else {
        this.pages[normalizedCurrentURL] = extractPageData("", this.baseUrl)        
      }
      return console.log(`${error}`)
    }

    // Check again if should stop crawling
    if (this.shouldStop) {
      return
    }

    // Extract and store page data
    this.pages[normalizedCurrentURL] = extractPageData(html, currentURL)

    // Get next urls to crawl
    const newURLs = getURLsFromHTML(html, this.baseUrl)
    
    const newCrawls: Promise<void>[] = []
    newURLs.forEach(async url => {
      const newTask = this.crawlPage(url)
      newCrawls.push(newTask)
    })
    await Promise.all(newCrawls)
  }

  async crawl(): Promise<Record<string, ExtractedPageData>> {
    await this.crawlPage(this.baseUrl)
    return this.pages
  }
}

export default async function crawlSiteAsync(
  url: string,
  limit: number,
  maxPages: number): Promise<Record<string, ExtractedPageData>> {
  const crawler = new ConcurrentCrawler(url, limit, maxPages)
  return await crawler.crawl()
}