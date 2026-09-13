import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllCategories, getPostsByCategory } from '@/lib/posts';
import PostCard from '@/components/PostCard';

interface Params {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.category }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  return { title: `分类：${decodeURIComponent(category)}` };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const posts = getPostsByCategory(decoded);
  if (posts.length === 0) notFound();

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-400">
        <Link
          href="/tags"
          className="hover:text-gray-900 dark:hover:text-gray-100"
        >
          分类
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 dark:text-gray-300">{decoded}</span>
      </nav>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">{decoded}</h1>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
