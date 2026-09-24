/**
 * Load-test fixture generator. Creates N synthetic essays + registry entries
 * in a SCRATCH COPY of the repo (never the working tree) to measure build
 * time, bundle sizes, and index size at scale. Usage:
 *   scripts/gen-fixture-posts.mjs <repo-copy-dir> <count>
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [, , repoDir, countRaw] = process.argv
const count = Number(countRaw)
if (!repoDir || !Number.isFinite(count) || count <= 0) {
  console.error('usage: gen-fixture-posts.mjs <repo-copy-dir> <count>')
  process.exit(1)
}

const lorem =
  'Hedgehogs view the world through one framework while foxes draw on eclectic sources and revise. '.repeat(
    40,
  )

for (let i = 0; i < count; i++) {
  const slug = `fixture-post-${String(i).padStart(5, '0')}`
  writeFileSync(
    join(repoDir, 'src', 'content', 'posts', `${slug}.mdx`),
    `*Essay fixture ${i}. Synthetic body for load testing — September 2026.*\n\n## Section ${i}\n\n${lorem}\n\n## References\n\nFixture, A. (${2000 + (i % 25)}). Journal of Fixtures, ${(i % 12) + 1}(1), 1–9.\n`,
  )
}

const tags = ['survey', 'forecasting', 'benchmarks', 'LLMs', 'methods']
const entries = []
for (let i = 0; i < count; i++) {
  const slug = `fixture-post-${String(i).padStart(5, '0')}`
  const day = String((i % 28) + 1).padStart(2, '0')
  entries.push(
    `  {\n    slug: '${slug}',\n    title: 'Fixture essay number ${i}: synthetic load-test post',\n    publishedAt: '2026-09-${day}T12:00:00Z',\n    description: 'Synthetic fixture essay ${i} for build load testing.',\n    tags: ['${tags[i % tags.length]}'],\n    provenance: 'human-written',\n    readingMinutes: 5,\n    load: () => import('./posts/${slug}.mdx'),\n  },`,
  )
}

const postsPath = join(repoDir, 'src', 'content', 'posts.ts')
const src = readFileSync(postsPath, 'utf8')
const marker = 'const POST_DEFS: PostDef[] = [\n'
writeFileSync(
  postsPath,
  src.replace(marker, `${marker}${entries.join('\n')}\n`),
)
console.log(`fixtures: ${count} posts + registry entries in ${repoDir}`)
