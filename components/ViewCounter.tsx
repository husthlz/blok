'use client';

import { useEffect, useState } from 'react';

/**
 * 基于 localStorage 的本地阅读量统计（静态站点无后端时的折中方案）。
 * 仅反映当前浏览器的访问次数，刷新会累加。
 */
export default function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const key = `views:${slug}`;

  useEffect(() => {
    try {
      const current = Number(localStorage.getItem(key) || '0');
      const next = current + 1;
      localStorage.setItem(key, String(next));
      setCount(next);
    } catch {
      setCount(null);
    }
  }, [key]);

  return (
    <span className="text-gray-400 dark:text-gray-500">
      阅读 {count ?? '·'}
    </span>
  );
}
