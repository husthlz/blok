/**
 * 全站配置（同时被 Next.js 应用与内容生成脚本引用）
 * 部署到 GitHub Pages 项目页时，通过环境变量覆盖：
 *   SITE_URL=https://username.github.io/blok  BASE_PATH=/blok npm run build
 */
export const siteConfig = {
  title: '个人博客',
  description: '学习笔记，记录学习过程。',
  author: 'husthlz',
  // 用于 RSS / sitemap 的绝对链接，部署时通过 SITE_URL 覆盖
  url: process.env.SITE_URL || 'https://example.github.io',
  // GitHub Pages 项目页基础路径，例如 /blok；用户页留空
  basePath: process.env.BASE_PATH || '',
  // 首页 Hero 背景图：默认使用 public/hero.png；也可设置 HERO_IMAGE 覆盖。
  heroImage: process.env.HERO_IMAGE || '/hero.png',
  about: '一路上花开花落，起起跌跌',
  postsDir: 'content/posts',
  postsPerPage: 10,
  nav: [
    { title: '首页', href: '/' },
    { title: '标签', href: '/tags' },
    { title: '搜索', href: '/search' },
  ],
  social: {
    github: 'https://github.com/husthlz',
    email: 'husthlz@hust.edu.cn',
  },
  rss: true,
};

export default siteConfig;
