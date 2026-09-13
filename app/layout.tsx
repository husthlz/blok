import './globals.css';
import type { Metadata } from 'next';
import { siteConfig } from '@/site.config.mjs';
import ThemeProvider from '@/components/ThemeProvider';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import Live2DWidget from '@/components/Live2DWidget';
import LeftDrawer from '@/components/LeftDrawer';
import { getAllTags, getAllCategories } from '@/lib/posts';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.title} · ${siteConfig.description}`,
    template: `%s · ${siteConfig.title}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col overflow-x-clip bg-white font-sans text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider>
          <Header />
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
            {children}
          </main>
          <SiteFooter />
          <Live2DWidget basePath={siteConfig.basePath} />
          <LeftDrawer tags={getAllTags()} categories={getAllCategories()} />
        </ThemeProvider>
      </body>
    </html>
  );
}
