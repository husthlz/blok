'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/site.config.mjs';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100"
        >
          {siteConfig.title}
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-2 py-1 text-sm transition-colors ${
                isActive(item.href)
                  ? 'font-medium text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {item.title}
            </Link>
          ))}
          {siteConfig.rss && (
            <a
              href={`${siteConfig.basePath}/rss.xml`}
              aria-label="RSS 订阅"
              className="rounded-md px-2 py-1 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              RSS
            </a>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
