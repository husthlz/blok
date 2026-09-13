import Link from 'next/link';
import { siteConfig } from '@/site.config.mjs';
import type { PostMeta } from '@/lib/posts';
import { formatDate, postUrl } from '@/lib/format';

/**
 * 首页主视觉：内容栏宽度内的圆角横幅（非全屏），背景图铺满横幅，
 * 站点标题与简介居中，底部叠加一个半透明的「最新文章」列表。
 * 未配置 heroImage 时回退为渐变背景。
 */
export default function Hero({ recent }: { recent: PostMeta[] }) {
  const hasImage = Boolean(siteConfig.heroImage);
  const bg = hasImage
    ? `linear-gradient(rgba(15,23,42,0.5),rgba(15,23,42,0.5)), url('${siteConfig.heroImage}')`
    : 'linear-gradient(135deg, #1e3a8a 0%, #6d28d9 55%, #db2777 100%)';

  return (
    <section
      className="relative flex min-h-[18rem] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-cover bg-center px-6 py-10 text-center text-white shadow-sm"
      style={{ backgroundImage: bg }}
    >
      {/* 标题 + 简介 */}
      <div className="relative w-full">
        <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm sm:text-4xl">
          {siteConfig.title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 sm:text-base">
          {siteConfig.description}
        </p>
      </div>

      {/* 最新文章：紧凑卡片，叠在横幅底部 */}
      {recent.length > 0 && (
        <div className="relative mt-2 w-full max-w-md rounded-xl border border-white/15 bg-black/30 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-white/90">最新文章</h2>
            <a
              href="#latest"
              className="text-xs text-white/70 transition-colors hover:text-white"
            >
              全部索引 ↓
            </a>
          </div>
          <ul className="space-y-1.5 text-sm">
            {recent.slice(0, 5).map((p) => (
              <li
                key={p.slug}
                className="flex items-baseline justify-between gap-3"
              >
                <Link
                  href={postUrl(p.slug)}
                  className="truncate text-white/90 transition-colors hover:text-white"
                >
                  {p.title}
                </Link>
                <time className="shrink-0 text-xs text-white/50">
                  {formatDate(p.date)}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
