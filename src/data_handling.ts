import { URL } from "node:url"
import { JSDOM } from "jsdom"

export function normalizeURL(inputURL:string): string {
  const urlObject = new URL(inputURL.toLowerCase())
  return `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname.replace(/\/$/, "")}`
}

export type ExtractedPageData = {
  url: string,
  h1: string,
  first_paragraph: string,
  outgoing_links: string[],
  image_urls: string[],
  visits: number
}

export function extractPageData(html: string, pageURL: string): ExtractedPageData {
  if (html === "" || pageURL === "") {
    return {
      url: pageURL,
      h1: "",
      first_paragraph: "",
      outgoing_links: [],
      image_urls: [],
      visits: 1
    }
  }
  if ((typeof html !== "string") || (typeof pageURL !== "string")) {
    throw new Error("html or pageURL parameter is not a string")
  }
  return {
    url: pageURL,
    h1: getH1FromHTML(html),
    first_paragraph: getFirstParagraphFromHTML(html),
    outgoing_links: getURLsFromHTML(html, pageURL),
    image_urls: getImagesFromHTML(html, pageURL),
    visits: 1
  }
}

export function getH1FromHTML(html: string): string {
  if (typeof html !== "string") {
    throw Error("html is not a string")
  }
  const doc = new JSDOM(html)
  const h1element = doc.window.document.querySelector("h1")
  if (!h1element) {
    return ""
  }
  return h1element.textContent.trim()
}

export function getFirstParagraphFromHTML(html: string): string {
  if (typeof html !== "string") {
    throw Error("html is not a string")
  }
  const doc = new JSDOM(html)
  let firstPara = ""
  const mainSection = doc.window.document.querySelector("main")
  if (mainSection) {
    const queryMainP = mainSection.querySelector("p")
    firstPara = queryMainP ? queryMainP.textContent : ""
  } 
  if (firstPara == "") {
    const queryP = doc.window.document.querySelector("p")
    firstPara = queryP ? queryP.textContent : ""
  }
  return firstPara.trim()
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
  if (typeof html !== "string") {
    throw Error("html is not a string")
  }
  const result: string[] = []
  const doc = new JSDOM(html)
  const queryA = doc.window.document.querySelectorAll("a")
  for (const a of queryA) {
    const link = a.getAttribute("href")
    if (link) {
      try {
        const linkObj = new URL(link, baseURL)
        result.push(linkObj.toString())
      } catch{ console.log(`Cannot parse url: ${link}`) }
    }
  }

  return result
}

export function getImagesFromHTML(html: string, baseURL: string): string[] {
  if (typeof html !== "string") {
    throw Error("html is not a string")
  }

  const result: string[] = []
  const doc = new JSDOM(html)
  const queryA = doc.window.document.querySelectorAll("img")
  for (const a of queryA) {
    const link = a.getAttribute("src")
    if (link) {
      const linkObj = new URL(link, baseURL)
      result.push(linkObj.toString())
    }
  }

  return result
}