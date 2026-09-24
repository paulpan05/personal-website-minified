/** Shared MDX-to-plain-text extraction for build-time scripts.
 *  Imported by build-search-index.mjs (static JSON index) and
 *  seed-search-db.mjs (D1 seed). Runs under plain Node at build time. */
export function toPlainText(mdx) {
  return (
    mdx
      // fenced code blocks: drop fences, keep code text (searchable)
      .replace(/```[\s\S]*?```/g, (block) =>
        block.replace(/```\w*\n?/g, ' '),
      )
      // MDX/JSX imports carry no prose
      .replace(/^import .*$/gm, ' ')
      // figcaptions carry real prose: keep inner text, drop the tags
      .replace(/<figcaption>([\s\S]*?)<\/figcaption>/gi, ' $1 ')
      // remaining JSX/HTML tags
      .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
      // images: keep alt text; links: keep label text
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
      // markdown table pipes, heading hashes, quotes, rules, emphasis
      .replace(/[|#>]/g, ' ')
      .replace(/(\*\*|__|\*|_|~~|`)/g, ' ')
      .replace(/-{3,}/g, ' ')
      .replace(/\s+/g, ' ')
  )
}
