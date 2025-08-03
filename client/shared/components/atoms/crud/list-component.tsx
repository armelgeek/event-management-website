"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/shared/components/atoms/ui/card';
import { Button } from '@/shared/components/atoms/ui/button';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';

interface ListComponentProps<T> {
  service: {
    list: (filters: Record<string, unknown>) => Promise<{ data: T[]; total: number }>;
  };
  queryKey: string[];
  filters?: Record<string, unknown>;
  title?: string;
  description?: string;
  className?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderFilters?: () => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;
  itemClassName?: string;
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function ListComponent<T>({
  service,
  queryKey,
  filters = {},
  title,
  description,
  className,
  renderItem,
  renderFilters,
  renderHeader,
  renderEmpty,
  renderError,
  itemClassName,
  gridCols = 3
}: ListComponentProps<T>) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...queryKey, filters],
    queryFn: () => service.list(filters)
  });

  const items = data?.data || [];
  const total = data?.total || 0;

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          {renderError ? (
            renderError(error as Error)
          ) : (
            <>
              <p className="text-muted-foreground mb-4">
                Erreur lors du chargement: {(error as Error).message}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Réessayer
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {(title || description || renderHeader) && (
        <div className="mb-6">
          {(title || description) && (
            <div className="mb-4">
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          )}
          {renderHeader && renderHeader()}
        </div>
      )}

      {renderFilters && (
        <div className="mb-6">
          {renderFilters()}
        </div>
      )}

      <div className="mb-4 text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          `${total} élément${total > 1 ? 's' : ''}`
        )}
      </div>

      {isLoading ? (
        <div className={`grid gap-6 ${gridColsClass[gridCols]}`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className={itemClassName}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {renderEmpty ? (
              renderEmpty()
            ) : (
              <p className="text-muted-foreground">Aucun élément trouvé</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 ${gridColsClass[gridCols]}`}>
          {items.map((item, index) => (
            <div key={index} className={itemClassName}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
