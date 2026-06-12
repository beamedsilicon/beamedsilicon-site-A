import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { FULL_ARTICLES, getFullArticle } from "@/lib/full-articles"
import { ArticleView } from "@/components/article-view"

export function generateStaticParams() {
  return FULL_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const article = getFullArticle(slug)
  if (!article) return { title: "Not Found" }
  return {
    title: article.title,
    description: article.subtitle,
    openGraph: { title: article.title, description: article.subtitle, type: "article" },
  }
}

export default async function ArticlePage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const article = getFullArticle(slug)
  if (!article) notFound()
  return <ArticleView article={article} />
}