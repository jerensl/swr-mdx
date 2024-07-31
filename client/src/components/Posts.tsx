import * as React from 'react'
import {getMDXComponent} from 'mdx-bundler/client'

export default function Post({code, frontmatter}: {code: string, frontmatter: any}) {
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <>
      <header>
        <h1>{frontmatter.title}</h1>
        <p>{frontmatter.description}</p>
      </header>
      <main>
        <Component />
      </main>
    </>
  )
}