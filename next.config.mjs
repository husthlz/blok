/**
 * Next.js 配置
 * - output: 'export' 生成纯静态站点，可直接托管到 GitHub Pages
 * - basePath / assetPrefix 用于 GitHub Pages 项目页（如 username.github.io/blok）
 *   部署到用户页（username.github.io）时无需设置；部署到项目页时：
 *   BASE_PATH=/blok npm run build
 */
const basePath = process.env.BASE_PATH || '';

/**
 * 仅在生产构建时启用 output: 'export'（静态导出用于 GitHub Pages）。
 * 开发模式下若开启，Next dev 会强制校验「请求路径必须命中 generateStaticParams() 生成的路径」，
 * 而它用未解码的 urlPathname 去比对已解码的预渲染路径，导致中文标签/分类（如 /tags/实验/）
 * 首次访问直接 500。dev 下不导出即可正常预览。
 */
const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isDev ? undefined : 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: basePath ? basePath : undefined,
  assetPrefix: basePath ? basePath : undefined,
  // 静态导出时这些包可能被用到，保持打包行为稳定
  reactStrictMode: true,
};

export default nextConfig;
