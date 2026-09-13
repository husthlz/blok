/**
 * 构建后内容生成脚本：读取 content/posts 下的 Markdown，
 * 生成 public/search-index.json（站内搜索索引）、public/rss.xml 与 public/sitemap.xml。
 * 由 npm run build 在 next build 之后自动执行。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { siteConfig } from '../site.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const postsDir = path.join(root, siteConfig.postsDir);
const publicDir = path.join(root, 'public');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeXml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function readPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data, content } = matter(raw);
      const tags = Array.isArray(data.tags)
        ? data.tags.map(String)
        : data.tags
          ? String(data.tags)
              .split(',')
              .map((t) => t.trim())
          : [];
      return {
        slug,
        title: data.title || slug,
        date: data.date ? String(data.date).slice(0, 10) : '1970-01-01',
        tags,
        category: data.category ? String(data.category) : '未分类',
        excerpt: data.excerpt || content.slice(0, 120).replace(/[#>*`\-]/g, '').trim(),
        content: stripMarkdown(content),
        url: `/posts/${slug}`,
        draft: Boolean(data.draft),
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function buildSearchIndex(posts) {
  const index = posts.map(({ slug, title, date, tags, category, excerpt, content, url }) => ({
    slug,
    title,
    date,
    tags,
    category,
    excerpt,
    content,
    url,
  }));
  fs.writeFileSync(
    path.join(publicDir, 'search-index.json'),
    JSON.stringify(index),
  );
  console.log(`✓ search-index.json (${index.length} 篇)`);
}

function buildRss(posts) {
  const base = (siteConfig.url || '').replace(/\/$/, '');
  const bp = siteConfig.basePath || '';
  const items = posts
    .map((p) => {
      const link = `${base}${bp}/posts/${p.slug}`;
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${base}${bp}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), xml);
  console.log(`✓ rss.xml (${posts.length} 篇)`);
}

function buildSitemap(posts) {
  const base = (siteConfig.url || '').replace(/\/$/, '');
  const bp = siteConfig.basePath || '';
  const urls = [
    `${base}${bp}/`,
    `${base}${bp}/tags`,
    ...posts.map((p) => `${base}${bp}/posts/${p.slug}`),
  ]
    .map(
      (u) =>
        `  <url><loc>${escapeXml(u)}</loc></url>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log(`✓ sitemap.xml (${posts.length + 2} 条)`);
}

function main() {
  ensureDir(publicDir);
  const posts = readPosts();
  buildSearchIndex(posts);
  if (siteConfig.rss) buildRss(posts);
  buildSitemap(posts);
  console.log('内容生成完成。');
}

main();
