"use client";
import React from 'react';
import { Card, CardHeader, CardContent } from '@/shared/components/atoms/ui/card';
import { Button } from '@/shared/components/atoms/ui/button';
import { useQueryState, parseAsInteger, parseAsStringEnum } from 'nuqs';
import { useEntity } from '@/shared/hooks/use-entity';
import { CreateModal, EditModal, DeleteDialog } from '@/shared/components/atoms/crud';
import type { CrudService, AdminConfig } from '@/shared/lib/admin/admin-generator';
import type { ZodSchema } from 'zod';

interface CrudListPageProps<T extends Record<string, unknown>> {
  service: CrudService<T>;
  queryKey: string[];
  entityName: string;
  config: AdminConfig;
  schema: ZodSchema;
  renderItem: (item: T, actions?: React.ReactNode) => React.ReactNode;
  renderFilters?: () => React.ReactNode;
  filters?: Record<string, string | number | undefined>;
  className?: string;
  title?: string;
  description?: string;
  icon?: string | React.ComponentType<{ className?: string }>;
  enableCreate?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  getItemLabel?: (item: T) => string;
}

export function CrudListPage<T extends Record<string, unknown> & { id: string }>({
  service,
  queryKey,
  entityName,
  config,
  schema,
  renderItem,
  renderFilters,
  filters,
  className,
  title,
  description,
  icon,
  enableCreate = true,
  enableEdit = true,
  enableDelete = true,
  getItemLabel
}: CrudListPageProps<T>) {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [sortBy] = useQueryState('sortBy', { defaultValue: '' });
  const [sortDir] = useQueryState('sortDir', parseAsStringEnum(['asc', 'desc']).withDefault('asc'));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pageSize', parseAsInteger.withDefault(12));

  const allFilters = {
    search,
    sortBy,
    sortDir,
    page,
    pageSize,
    ...(filters || {})
  };

  const {
    items,
    meta,
    isLoading,
    isError,
    error,
    refetch
  } = useEntity({
    service,
    queryKey,
    entityName,
    filters: allFilters
  });

  const displayTitle = title || config.title || `Gestion des ${entityName}s`;
  const displayDescription = description || config.description;
  const displayIcon = icon || config.icon;

  if (isError) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-destructive">Erreur lors du chargement: {error?.message}</p>
            <Button onClick={() => refetch()} className="mt-2">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-0 border-b-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 px-2">
          <div className="flex items-center justify-center gap-4 min-w-0">
            {typeof displayIcon === 'string' && (
              <div className="flex items-center justify-center rounded-full bg-muted w-12 h-12">
                <div className="text-3xl select-none shadow-sm" aria-hidden>{displayIcon}</div>
              </div>
            )}
            {typeof displayIcon === 'function' && React.createElement(displayIcon, { className: 'w-10 h-10 text-primary bg-muted rounded-full p-2 shadow-sm' })}
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold text-primary truncate leading-tight">{displayTitle}</h1>
              {displayDescription && (
                <p className="text-muted-foreground text-base truncate max-w-[500px] mt-1">{displayDescription}</p>
              )}
            </div>
          </div>
          {enableCreate && (
            <CreateModal
              service={service}
              queryKey={queryKey}
              entityName={entityName}
              config={config}
              schema={schema}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {renderFilters && renderFilters()}
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const actions = (enableEdit || enableDelete) && (
                <div className="flex items-center gap-2 mt-4">
                  {enableEdit && (
                    <EditModal
                      service={service}
                      queryKey={queryKey}
                      entityName={entityName}
                      config={config}
                      schema={schema}
                      itemId={item.id}
                      className="flex-1"
                    />
                  )}
                  {enableDelete && (
                    <DeleteDialog
                      service={service}
                      queryKey={queryKey}
                      entityName={entityName}
                      itemId={item.id}
                      itemLabel={getItemLabel ? getItemLabel(item) : item.id}
                      className="flex-1"
                    />
                  )}
                </div>
              );
              
              return (
                <div key={item.id} className="flex flex-col h-full">
                  {renderItem(item, actions)}
                </div>
              );
            })}
          </div>
        )}

        {/* Message si aucune donnée */}
        {!isLoading && items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun {entityName} trouvé.</p>
            {enableCreate && (
              <CreateModal
                service={service}
                queryKey={queryKey}
                entityName={entityName}
                config={config}
                schema={schema}
                trigger={
                  <Button className="mt-4">
                    Créer le premier {entityName}
                  </Button>
                }
              />
            )}
          </div>
        )}
        
        {/* Pagination */}
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
