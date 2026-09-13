'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/site.config.mjs';

/**
 * 全局左侧抽屉侧边栏：固定在视口左侧、覆盖整个页面上层（z-50），可滑出/收起。
 * 默认收起，用户偏好通过 localStorage 记忆。点击遮罩或关闭按钮均可收起。
 */
export default function LeftDrawer({
  tags,
  categories,
}: {
  tags: { tag: string; count: number }[];
  categories: { category: string; count: number }[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('left-drawer-open');
    if (saved !== null) setOpen(saved === '1');
  }, []);

  const toggle = (next?: boolean) => {
    setOpen((o) => {
      const v = next ?? !o;
      localStorage.setItem('left-drawer-open', v ? '1' : '0');
      return v;
    });
  };

  return (
    <>
      {/* 切换按钮（视口左上角，层级高于顶栏）；抽屉展开时隐藏，避免遮挡抽屉本体 */}
      <button
        type="button"
        onClick={() => toggle()}
        aria-label="打开侧边栏"
        aria-expanded={open}
        className={`fixed top-4 left-4 z-[60] inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-lg backdrop-blur transition duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:bg-gray-800 ${
          open ? 'pointer-events-none translate-x-[-120%] opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        <span className="text-base leading-none">≡</span>
        侧边栏
      </button>

      {/* 遮罩 */}
      <div
        onClick={() => toggle(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* 抽屉本体 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[82vw] flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 dark:border-gray-800 dark:bg-gray-950 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <span className="text-base font-bold text-gray-900 dark:text-gray-100">
            {siteConfig.title}
          </span>
          <button
            type="button"
            onClick={() => toggle(false)}
            aria-label="收起侧边栏"
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => toggle(false)}
              className="rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-6">
          {categories.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                分类
              </h3>
              <ul className="space-y-1">
                {categories.map((c) => (
                  <li key={c.category}>
                    <Link
                      href={`/categories/${encodeURIComponent(c.category)}`}
                      onClick={() => toggle(false)}
                      className="flex items-center justify-between rounded-md px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <span>{c.category}</span>
                      <span className="text-xs text-gray-400">{c.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tags.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link
                    key={t.tag}
                    href={`/tags/${encodeURIComponent(t.tag)}`}
                    onClick={() => toggle(false)}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    #{t.tag}
                    <span className="text-gray-400">{t.count}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              关于
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {siteConfig.about}
            </p>
            <div className="mt-3 flex gap-4 text-sm">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                GitHub
              </a>
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                邮箱
              </a>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
