import { URL } from "node:url"

export function normalizeURL(inputURL:string): string {
  inputURL = inputURL.toLowerCase()
  const urlObject = new URL(inputURL)
  if (!urlObject.protocol) {
    urlObject.protocol = "https:"
  }
  const normalizedURL = new URL("https://base.com")
  normalizedURL.protocol = urlObject.protocol
  normalizedURL.hostname = urlObject.hostname
  normalizedURL.pathname = urlObject.pathname.replace(/\/$/, "")

  return normalizedURL.toString()
}