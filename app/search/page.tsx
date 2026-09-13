'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { formatDate } from '@/lib/format';

interface SearchEntry {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt: string;
  content: string;
  url: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchEntry[]) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'tags', weight: 1.5 },
          { name: 'excerpt', weight: 1 },
          { name: 'content', weight: 0.5 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        includeMatches: false,
      }),
    [entries],
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return entries;
    return fuse.search(q).map((r) => r.item);
  }, [query, fuse, entries]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">搜索</h1>
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入关键词，搜索标题、标签与正文…"
        className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />

      {loading ? (
        <p className="text-gray-500">加载中…</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">没有找到与“{query}”相关的文章。</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.slug} className="py-4">
              <Link
                href={item.url}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
              >
                {item.title}
              </Link>
              <div className="mt-1 text-xs text-gray-400">
                {formatDate(item.date)} · {item.category}
              </div>
              {item.excerpt && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {item.excerpt}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
