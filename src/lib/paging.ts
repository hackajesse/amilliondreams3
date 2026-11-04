export function paginate<T>(items: readonly T[], pageSize: number): T[][] {
  if (pageSize < 1) throw new Error("pageSize must be at least 1.");
  const pages: T[][] = [];
  for (let index = 0; index < items.length; index += pageSize) {
    pages.push(items.slice(index, index + pageSize));
  }
  return pages;
}

export function pageHref(base: string, page: number): string {
  const root = base.endsWith("/") ? base.slice(0, -1) : base;
  if (page <= 1) return `${root}/`;
  return `${root}/page/${page}/`;
}
