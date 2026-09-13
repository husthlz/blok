import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeHighlight)
  .use(rehypeStringify);

/** 将 Markdown 渲染为带语法高亮与标题锚点的 HTML 字符串 */
export async function renderMarkdown(md: string): Promise<string> {
  const file = await processor.process(md);
  return String(file);
}
