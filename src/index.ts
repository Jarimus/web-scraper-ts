import crawlSiteAsync from './concurrent_crawler'
import { crawlPage } from './crawl'
import { getHTML } from './getHTML'

async function main() {
  const args = process.argv.slice(2)
  if (args.length == 0) {
    console.log("Usage: <url> [limit]")
    process.exit(1)
  }
  if (args.length >= 4) {
    console.log("Too many arguments")
    process.exit(1)
  }
  let limit = 1
  let maxPages = 25
  if (args.length >= 2) {
    try {
      limit = Number(args[1])
    } catch{ return console.log('Provide a valid number for limit.') }
  }
  if (args.length === 3) {
    try {
      maxPages = Number(args[2])
    } catch{ return console.log('Provide a valid number for max pages.') }
  }
  const url = args[0]
  console.log(`Starting crawl: ${url}`)

  // const pageCounts = await crawlPage(url)
  const pageCounts = await crawlSiteAsync(url, limit, maxPages)

  if (!pageCounts) {
    return console.log("No pages")
  }

  console.log(`Crawled ${Object.keys(pageCounts).length} pages.`)
  console.log("Internal links:")
  for (const key in pageCounts) {
    console.log(`${key}: ${pageCounts[key].visits}`)
  }
}

main();