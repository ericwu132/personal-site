import type { IncomingMessage, ServerResponse } from 'node:http'

/** Fetch the original on demand; keep the story out of the site's source. */
export default async function egg(_request: IncomingMessage, response: ServerResponse) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  try {
    const source = await fetch('https://www.galactanet.com/oneoff/theegg.html', {
      signal: AbortSignal.timeout(10000),
    })
    if (!source.ok) throw new Error('Source unavailable')
    // Some Node runtimes decode Windows-1252 as Latin-1, leaving smart
    // punctuation as invisible C1 controls. Normalize those explicitly.
    const punctuation: Record<string, string> = {
      '\u0085': '\u2026',
      '\u0091': '\u2018',
      '\u0092': '\u2019',
      '\u0093': '\u201c',
      '\u0094': '\u201d',
      '\u0096': '\u2013',
      '\u0097': '\u2014',
    }
    const html = new TextDecoder('windows-1252')
      .decode(await source.arrayBuffer())
      .replace(/[\u0085\u0091-\u0094\u0096\u0097]/g, (character) => punctuation[character])
    response.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
    response.end(JSON.stringify({ html }))
  } catch {
    response.statusCode = 502
    response.end(JSON.stringify({ error: 'The original story is temporarily unavailable.' }))
  }
}
