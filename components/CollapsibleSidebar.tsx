'use client';

import { useEffect, useState } from 'react';

/**
 * 可折叠的侧边栏布局：在桌面端右侧放置 sidebar，点击按钮可在「双栏 / 单栏」间切换。
 * 折叠时主内容占满整宽；用户选择通过 localStorage 记忆。
 */
export default function CollapsibleSidebar({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  // 客户端读取上次的偏好，避免 SSR/CSR hydration 不一致
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open');
    if (saved !== null) setOpen(saved === '1');
  }, []);

  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      localStorage.setItem('sidebar-open', next ? '1' : '0');
      return next;
    });
  };

  return (
    <>
      <div
        className={`mt-10 grid gap-10 ${
          open ? 'lg:grid-cols-[minmax(0,1fr)_256px]' : 'grid-cols-1'
        }`}
      >
        <div className="space-y-10">{children}</div>
        {open && <div className="hidden lg:block">{sidebar}</div>}
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={open}
        className="fixed bottom-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-lg backdrop-blur transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            open ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        />
        {open ? '收起侧边栏' : '展开侧边栏'}
      </button>
    </>
  );
}
