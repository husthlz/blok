import Link from 'next/link';
import { getPublishedPosts, getAllTags, type PostMeta } from '@/lib/posts';
import { formatDate, postUrl } from '@/lib/format';
import Hero from '@/components/Hero';
import SakuraRain from '@/components/SakuraRain';

export default function HomePage() {
  const posts = getPublishedPosts();
  const tags = getAllTags().slice(0, 14); // 主要标签
  const recent = posts.slice(0, 8); // 侧边栏最新文章

  // 索引：按年份分组
  const byYear = new Map<string, PostMeta[]>();
  for (const p of posts) {
    const year = p.date.slice(0, 4);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(p);
  }
  const years = [...byYear.entries()].sort((a, b) =>
    b[0].localeCompare(a[0]),
  );

  return (
    <>
      <SakuraRain />
      <Hero recent={recent} />

      <div className="mt-10 space-y-10">
        {/* 主要标签 */}
        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
            主要标签
          </h2>
          {tags.length === 0 ? (
            <p className="text-sm text-gray-400">暂无标签</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t.tag}
                  href={`/tags/${encodeURIComponent(t.tag)}`}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  #{t.tag}
                  <span className="text-gray-400">{t.count}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 索引 */}
        <section id="latest">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
            索引
          </h2>
          <div className="space-y-6">
            {years.map(([year, list]) => (
              <div key={year}>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {year} 年
                </h3>
                <ul className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                  {list.map((p) => (
                    <li
                      key={p.slug}
                      className="flex items-baseline justify-between gap-4 py-2"
                    >
                      <Link
                        href={postUrl(p.slug)}
                        className="text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                      >
                        {p.title}
                      </Link>
                      <time className="shrink-0 text-xs text-gray-400">
                        {formatDate(p.date)}
                      </time>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
