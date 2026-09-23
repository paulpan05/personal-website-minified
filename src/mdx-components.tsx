import type { ComponentType } from 'react'

// Required by @next/mdx with the App Router: compiled MDX imports
// `useMDXComponents` from this file (not from @mdx-js/react, whose
// React-context provider crashes in Server Components). Entries here
// override default element rendering; empty keeps standard elements,
// which are styled via src/styles/_blog.scss.
export function useMDXComponents(): Record<string, ComponentType> {
  return {}
}
