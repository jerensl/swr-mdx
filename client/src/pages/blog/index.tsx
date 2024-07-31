import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'

export const getStaticProps: GetStaticProps = async () => {
    const posts = await fetch('http://localhost:5000/contents')

    const data = await posts.json()
    return {
        props: { posts: data },
    }
}

export default function Blog({
    posts,
}: InferGetStaticPropsType<typeof getStaticProps>): React.ReactElement {


    return (
        <>
         {
            posts?.contents.map(({title, description, slug}: {title: string, description: string, slug: string}) => {
                return (
                    <><h1><Link href={`blog/${slug}`}>{title}</Link></h1><p>{description}</p></>
                )
            })
         }
        </>
    )
}