import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { formatDate, postUrl } from '@/lib/format';
import ViewCounter from './ViewCounter';

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group border-b border-gray-100 py-6 dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>·</span>
        <span>{post.readingTime} 分钟阅读</span>
        <span>·</span>
        <ViewCounter slug={post.slug} />
      </div>
      <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        <Link
          href={postUrl(post.slug)}
          className="transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="mt-2 line-clamp-2 text-gray-600 dark:text-gray-400">
          {post.excerpt}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
