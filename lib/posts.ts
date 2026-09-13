import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import siteConfig from '@/site.config.mjs';

const postsDir = path.join(process.cwd(), siteConfig.postsDir);

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt: string;
  cover?: string;
  readingTime: number;
  draft: boolean;
}

export interface Post extends PostMeta {
  /** 原始 Markdown 正文 */
  content: string;
}

/** 将 frontmatter 的 date 统一规整为 YYYY-MM-DD（兼容 Date 对象与字符串） */
function toISODate(d: unknown): string {
  if (d instanceof Date) {
    if (Number.isNaN(d.getTime())) return '1970-01-01';
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  const s = String(d ?? '').trim();
  const m = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.exec(s);
  if (m) {
    const y = m[1];
    const mo = String(Number(m[2])).padStart(2, '0');
    const day = String(Number(m[3])).padStart(2, '0');
    return `${y}-${mo}-${day}`;
  }
  return '1970-01-01';
}

/** 根据字数估算阅读时长（分钟），中文按 350 字/分、英文按 200 词/分 */
function calcReadingTime(text: string): number {
  const cn = (text.match(/[一-龥]/g) || []).length;
  const en = (text.match(/[a-zA-Z0-9]+/g) || []).length;
  const minutes = cn / 350 + en / 200;
  return Math.max(1, Math.ceil(minutes));
}

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, '');
  const fullPath = path.join(postsDir, fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const tags: string[] = Array.isArray(data.tags)
    ? data.tags.map((t: unknown) => String(t))
    : data.tags
      ? String(data.tags)
          .split(',')
          .map((t: string) => t.trim())
      : [];
  return {
    slug,
    title: data.title || slug,
    date: toISODate(data.date),
    tags,
    category: data.category ? String(data.category) : '未分类',
    excerpt: data.excerpt || content.slice(0, 120).replace(/[#>*`\-]/g, '').trim(),
    cover: data.cover,
    readingTime: calcReadingTime(content),
    draft: Boolean(data.draft),
    content,
  };
}

function readAll(): Post[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map(readPostFile);
}

/** 所有文章（含草稿），按日期倒序 */
export function getAllPosts(): Post[] {
  return readAll().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** 已发布文章（排除草稿） */
export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => !p.draft);
}

export function getPostBySlug(slug: string): Post | null {
  return readAll().find((p) => p.slug === slug) || null;
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getPublishedPosts()) {
    for (const t of p.tags) map.set(t, (map.get(t) || 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): Post[] {
  return getPublishedPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

export function getAllCategories(): { category: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getPublishedPosts()) {
    map.set(p.category, (map.get(p.category) || 0) + 1);
  }
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByCategory(category: string): Post[] {
  return getPublishedPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
}
