import { useQuery } from '@tanstack/react-query'
import { tagService } from '../tag.service'

export function useTags(filters?: Record<string, unknown>) {
  const safeFilters = filters
    ? Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) =>
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        )
      ) as Record<string, string | number | boolean>
    : undefined;

  return useQuery({
    queryKey: ['tags', safeFilters],
    queryFn: () => tagService.list(safeFilters),
    staleTime: 5 * 60 * 1000
  })
}
