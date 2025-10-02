/**
 * Pagination utilities
 */

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    nextOffset?: number;
  };
}

/**
 * Parse and validate pagination parameters from query string
 */
export function parsePaginationParams(query: any): { limit: number; offset: number } {
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 50); // Default 10, max 50
  const offset = Math.max(parseInt(query.offset) || 0, 0); // Default 0, min 0

  return { limit, offset };
}

/**
 * Apply pagination to an array of items
 */
export function paginateArray<T>(
  items: T[],
  limit: number,
  offset: number
): PaginationResult<T> {
  const total = items.length;
  const paginatedItems = items.slice(offset, offset + limit);
  const hasMore = offset + limit < total;
  const nextOffset = hasMore ? offset + limit : undefined;

  return {
    items: paginatedItems,
    pagination: {
      total,
      limit,
      offset,
      hasMore,
      ...(hasMore && { nextOffset: offset + limit })
    }
  };
}