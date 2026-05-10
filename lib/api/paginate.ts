export function buildCursorArgs(cursor?: string, limit = 20) {
  return {
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  };
}

export function paginatedResponse<T extends { id: string }>(
  items: T[],
  limit: number
) {
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  return {
    data,
    nextCursor: hasMore ? data[data.length - 1].id : null,
    hasMore,
    count: data.length,
  };
}