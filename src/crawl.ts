import { URL } from "node:url"
import { JSDOM } from "jsdom"

export function normalizeURL(inputURL:string): string {
  const urlObject = new URL(inputURL.toLowerCase())
  return `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname.replace(/\/$/, "")}`
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
  const mainSection = doc.window.document.querySelector("main")
  let firstPara = ""
  if (mainSection) {
    const queryMainP = mainSection.querySelector("p")
    firstPara = queryMainP ? queryMainP.textContent : ""
  } 
  if (firstPara === "") {
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
      const linkObj = new URL(link, baseURL)
      result.push(linkObj.toString())
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