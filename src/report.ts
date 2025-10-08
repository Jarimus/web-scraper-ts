import * as fs from 'node:fs'
import * as path from 'node:path'
import { ExtractedPageData } from './data_handling'

export function csvEscape(field: string): string {
  const str = field ?? "";
  const needsQuoting = /[",\n]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

export default function writeCSVReport(pageData:Record<string, ExtractedPageData>, filename = 'report.csv'): void {
  const headers = ["page_url", "h1", "first_paragraph", "outgoing_link_urls", "image_urls"]
  const rows: string[] = [headers.join(",")]

  // append page data
  Object.values(pageData).forEach(data => {
    const dataStringified = `${csvEscape(data.url)},${csvEscape(data.h1)},${csvEscape(data.first_paragraph)},${csvEscape(data.outgoing_links.join(";"))},${csvEscape(data.image_urls.join(";"))}`
    rows.push(dataStringified)
  })

  // Write to file
  const filepath = path.resolve(process.cwd(), filename)
  fs.writeFileSync(filepath, rows.join("\n"))
}

