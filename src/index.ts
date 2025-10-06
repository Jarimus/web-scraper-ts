import { getHTML } from './getHTML'

async function main() {
  const args = process.argv.slice(2)
  if (!args) {
    console.log("Please provide url to crawl")
    process.exit(1)
  }
  if (args.length > 1) {
    console.log("Too many arguments")
    process.exit(1)
  }
  const url = args[0]
  console.log(`Starting crawl: ${url}`)

  const html = await getHTML(url)
  console.log(html)
}

main();