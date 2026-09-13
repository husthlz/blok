/** 将 YYYY-MM-DD 格式化为更友好的中文日期（按字符串解析，避免时区错位） */
export function formatDate(date: string): string {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(date);
  if (m) {
    const [, y, mo, da] = m;
    return `${y}年${Number(mo)}月${Number(da)}日`;
  }
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 文章页 URL（不含 basePath，由 Next <Link> 自动处理） */
export function postUrl(slug: string): string {
  return `/posts/${slug}`;
}
