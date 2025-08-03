import { useQuery } from '@tanstack/react-query';
import { safeCategoryCrudService } from '../category.service';

export function useCategories(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => safeCategoryCrudService.fetchItems(params),
  });
}
