import Link from 'next/link';

export default function TagList({
  items,
}: {
  items: { name: string; count: number; href: string }[];
}) {
  if (items.length === 0) {
    return <p className="text-gray-500">暂无内容。</p>;
  }
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
        >
          {item.name}
          <span className="text-xs text-gray-400">{item.count}</span>
        </Link>
      ))}
    </div>
  );
}
