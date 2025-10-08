import crawlSiteAsync from './concurrent_crawler'
import { crawlPage } from './crawl'
import { getHTML } from './getHTML'
import writeCSVReport from './report'

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
  let limit = 3
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
  const pageData = await crawlSiteAsync(url, limit, maxPages)

  if (!pageData) {
    return console.log("No pages")
  }

  console.log(`Crawled ${Object.keys(pageData).length} pages.`)
  console.log("Internal links:")
  for (const key in pageData) {
    console.log(`${key}: ${pageData[key].visits}`)
  }

  const reportFilename = 'report.csv'
  try {
    writeCSVReport(pageData, reportFilename)
    console.log(`Report saved to ${reportFilename}`)
  } catch(error) {console.log(`Error writing report to file: ${error}`)}
  
}

main();