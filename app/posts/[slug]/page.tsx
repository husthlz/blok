import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { renderMarkdown } from '@/lib/markdown';
import { formatDate } from '@/lib/format';
import ViewCounter from '@/components/ViewCounter';

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: '文章未找到' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.draft) notFound();

  const html = await renderMarkdown(post.content);

  return (
    <article>
      <header className="border-b border-gray-100 pb-6 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime} 分钟阅读</span>
          <span>·</span>
          <ViewCounter slug={post.slug} />
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <Link
            href={`/categories/${encodeURIComponent(post.category)}`}
            className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
          >
            {post.category}
          </Link>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      <div
        className="prose prose-gray mt-8 max-w-none dark:prose-invert prose-headings:scroll-mt-20"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <footer className="mt-12 border-t border-gray-100 pt-6 dark:border-gray-800">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← 返回首页
        </Link>
      </footer>
    </article>
  );
}
