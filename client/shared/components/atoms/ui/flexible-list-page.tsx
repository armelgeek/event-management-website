import React from 'react';
import { Card, CardHeader, CardContent } from '@/shared/components/atoms/ui/card';
import { Button } from '@/shared/components/atoms/ui/button';
import { useQueryState, parseAsInteger, parseAsStringEnum } from 'nuqs';
import { useParams } from 'next/navigation';
import { useAdminEntity } from '@/shared/hooks/use-admin-entity';
import type { AdminConfigWithChild } from '@/shared/lib/admin/admin-generator';

interface FlexibleListPageProps<T extends Record<string, unknown>> {
  config: AdminConfigWithChild<T>;
  renderItem: (item: T, actions: React.ReactNode) => React.ReactNode;
  renderFilters?: () => React.ReactNode;
  filters?: Record<string, string | number | undefined>;
  className?: string;
}

export function FlexibleListPage<T extends Record<string, unknown>>({
  config,
  renderItem,
  renderFilters,
  filters,
  className
}: FlexibleListPageProps<T>) {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [sortBy] = useQueryState('sortBy', { defaultValue: '' });
  const [sortDir] = useQueryState('sortDir', parseAsStringEnum(['asc', 'desc']).withDefault('asc'));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pageSize', parseAsInteger.withDefault(12));

  const params = useParams();
  let parentId: string | undefined = undefined;
  if ('parent' in config && config.parent && typeof config.parent === 'object' && 'routeParam' in config.parent) {
    const paramValue = params?.[config.parent.routeParam as string];
    parentId = Array.isArray(paramValue) ? paramValue[0] : paramValue;
  }

  if (!config.services) {
    throw new Error(`Services not configured for ${config.title}. Please add services to your config or use the regular AdminPage component.`);
  }
  if (!config.queryKey) {
    throw new Error(`QueryKey not configured for ${config.title}. Please add queryKey to your config.`);
  }

  const filtersFromNuqs = {
    search,
    sortBy,
    sortDir,
    page,
    pageSize,
    ...(filters || {}),
    ...(
      config.parent &&
      typeof config.parent === 'object' &&
      'key' in config.parent &&
      parentId
        ? { [config.parent.key as string]: parentId }
        : {}
    ),
  };

  const {
    data: items,
    meta
  } = useAdminEntity({
    config,
    customServices: config.services,
    queryKey: config.queryKey,
    onSuccess: {
      create: () => {},
      update: () => {},
      delete: () => {},
    },
    filters: filtersFromNuqs,
    parentId,
  });

  const itemsTyped = items as T[];

  return (
    <Card className={className}>
      <CardHeader className="pb-0 border-b-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 px-2">
          <div className="flex items-center justify-center gap-4 min-w-0">
            {typeof config.icon === 'string' && (
              <div className="flex items-center justify-center  rounded-full bg-muted w-12 h-12">
                <div  className="text-3xl select-none shadow-sm" aria-hidden>{config.icon}</div>
              </div>
            )}
            {typeof config.icon === 'function' && React.createElement(config.icon, { className: 'w-10 h-10 text-primary bg-muted rounded-full p-2 shadow-sm' })}
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold text-primary truncate leading-tight">{config.title}</h1>
              {config.description && (
                <p className="text-muted-foreground text-base truncate max-w-[500px] mt-1">{config.description}</p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
        <CardContent>
          {renderFilters && renderFilters()}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {itemsTyped.map((item) => {
              const actions = null;
              return (
                <div key={(item as Record<string, unknown>).id as string} className="flex flex-col h-full">
                  {renderItem(item, actions)}
                </div>
              );
            })}
          </div>
          {/* Pagination au-dessous */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="ghost"
                disabled={(page ?? 1) <= 1}
                onClick={() => setPage(Math.max(1, (page ?? 1) - 1))}
              >
                Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} / {meta.totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={meta ? (page ?? 1) >= meta.totalPages : true}
                onClick={() => setPage(Math.min(meta.totalPages, (page ?? 1) + 1))}
              >
                Suivant
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
  );
}
