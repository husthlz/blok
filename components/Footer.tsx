import Link from 'next/link';
import { siteConfig } from '@/site.config.mjs';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-4 py-8 text-sm text-gray-500 dark:text-gray-400">
        <p>
          © {year} {siteConfig.author}. 由{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-gray-900 dark:hover:text-gray-100"
          >
            Next.js
          </a>{' '}
          构建 · 托管于 GitHub Pages
        </p>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-900 dark:hover:text-gray-100"
          >
            GitHub
          </a>
          <a
            href={`mailto:${siteConfig.social.email}`}
            className="hover:text-gray-900 dark:hover:text-gray-100"
          >
            邮箱
          </a>
          {siteConfig.rss && (
            <Link href={`${siteConfig.basePath}/rss.xml`} className="hover:text-gray-900 dark:hover:text-gray-100">
              RSS
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
