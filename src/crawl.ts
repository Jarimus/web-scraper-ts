import { URL } from "node:url"
import { getURLsFromHTML, normalizeURL } from "./data_handling"
import { getHTML } from "./getHTML"

export async function crawlPage(
  baseURL: string,
  currentURL: string = baseURL,
  pages: Record<string, number> = {},
) {
  // Stay within the same domain. Do not crawl further.
  const baseURLobj = new URL(baseURL)
  const currentURLobj = new URL(currentURL)
  if (baseURLobj.origin !== currentURLobj.origin) {
    return pages
  }
  // Check with the normalized URL whether the page has been visited already.
  // Only increment if it has been visited before.
  const normalizedCurrentURL = normalizeURL(currentURL)
  if (pages[normalizedCurrentURL]) {
    pages[normalizedCurrentURL]++
    return
  } else {
    pages[normalizedCurrentURL] = 1
  }
  // get HTML for current URL
  console.log(`Getting html for ${currentURL}`)
  let html = ""
  try {
    html = await getHTML(currentURL)
  } catch {
    return
  }
  const newURLs = getURLsFromHTML(html, baseURL)
  const newCrawls: Promise<Record<string, number> | undefined>[] = []
  newURLs.forEach(async url => {
    newCrawls.push(crawlPage(baseURL, url, pages))
  })
  await Promise.all(newCrawls)

  return pages
}