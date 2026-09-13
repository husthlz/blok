import { getAllTags } from '@/lib/posts';
import TagList from '@/components/TagList';

export const metadata = {
  title: '标签',
  description: '按标签浏览全部文章',
};

export default function TagsPage() {
  const tags = getAllTags();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">标签</h1>
      <TagList
        items={tags.map((t) => ({
          name: t.tag,
          count: t.count,
          href: `/tags/${encodeURIComponent(t.tag)}`,
        }))}
      />
    </div>
  );
}
