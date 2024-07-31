import { useMemo } from 'react'
import useSWR from 'swr'
import { getMDXComponent } from 'mdx-bundler/client'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Post from "@/components/Posts"
import Link from 'next/link'

const fetcher = (url:string) => fetch(url).then(r => r.json())

const components: import('mdx/types').MDXComponents = {
    h1: ({ children, id }: React.HTMLProps<HTMLHeadingElement>) => {
        return (
            <h2 id={id} className="text-lg scroll-mt-20">
                {children}
            </h2>
        )
    },
}

export const getStaticPaths: GetStaticPaths = async () => {
    const files = await fetch('http://localhost:5000/path')

    const data = await files.json()
    return {
        paths: data.files.map((slug: string) => ({
            params: {
                slug: slug
            }   
        })),
        fallback: false,
    }
}


export const getStaticProps: GetStaticProps = async (
    context: GetStaticPropsContext
) => {
    return {
        props: { slug: context.params?.slug },
    }
}


export default function Blog({
    slug
}: InferGetStaticPropsType<typeof getStaticProps>): React.ReactElement {
    const { data, error, isLoading } = useSWR<{code: string, frontmatter: any}>(`http://localhost:5000/content/${slug}`, fetcher)


    if (error || data === undefined) {
        return <>Something wrong happened...</>
    }

    if (isLoading) {
        return <>Loading...</>
    }



    return (
        <>
                <article
                    id="mdx"
                    className="prose mx-4 sm:mx-0 sm:ml-20 flex-1 max-w-4xl m-auto dark:prose-invert prose-p:font-normal prose-li:font-normal lg:prose-lg"
                >
                    <Post code={data.code} frontmatter={data.frontmatter}/>
                    <Link href={'/blog'}>Back to see blogpost</Link>
                </article>
        </>
    )
}