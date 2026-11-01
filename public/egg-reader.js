async function loadStory() {
  const status = document.getElementById('reading-status')
  const story = document.getElementById('story')
  try {
    const response = await fetch('/api/egg?v=2')
    if (!response.ok) throw new Error('Source unavailable')
    const { html } = await response.json()
    const source = new DOMParser().parseFromString(html, 'text/html')
    // Import plain paragraph text only, never the source's scripts or styles.
    const paragraphs = Array.from(source.body.querySelectorAll('p'))
      .map((paragraph) => paragraph.textContent.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
    const byline = paragraphs.findIndex((text) => /^By:\s*Andy Weir$/i.test(text))
    if (byline < 0 || paragraphs.length <= byline + 1) throw new Error('Source format changed')
    const content = document.createDocumentFragment()
    for (const text of paragraphs.slice(byline + 1)) {
      const paragraph = document.createElement('p')
      paragraph.textContent = text
      content.append(paragraph)
    }
    story.replaceChildren(content)
    story.hidden = false
    status.hidden = true
  } catch {
    status.textContent = 'The story could not load. Please use the “open original” link above.'
  }
}

loadStory()
