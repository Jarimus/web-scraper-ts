export async function getHTML(url: string) {
  const res = await fetch(url, {
    headers: {'User-Agent': 'BootCrawler/1.0'}
  })
  if (!res.ok) {
    throw new Error(`Error status: ${res.status}`)
  }
  const type = res.headers.get('Content-Type')
  if (!type || !type.includes('text/html')) {
    throw new Error(`Page is not text/html: ${type}`)
  }
  return await res.text()
}