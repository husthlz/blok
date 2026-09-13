import { siteConfig } from '@/site.config.mjs';

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/**
 * 侧边栏：关于（最近文章列表已叠到首页背景图上，此处不再重复）。
 */
export default function Sidebar() {
  return (
    <aside className="space-y-6">
      <Card title="关于">
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
      </Card>
    </aside>
  );
}
