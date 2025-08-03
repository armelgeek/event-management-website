"use client";
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/shared/components/atoms/ui/alert-dialog';
import { Button } from '@/shared/components/atoms/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useEntityCrud } from '@/shared/hooks/use-entity-crud';
import type { CrudService } from '@/shared/lib/admin/admin-generator';

interface DeleteDialogProps<T extends Record<string, unknown>> {
  service: CrudService<T>;
  queryKey: string[];
  entityName: string;
  itemId: string;
  itemLabel?: string;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  onSuccess?: (id: string) => void;
  className?: string;
}

export function DeleteDialog<T extends Record<string, unknown> & { id?: string }>({
  service,
  queryKey,
  entityName,
  itemId,
  itemLabel,
  title,
  description,
  trigger,
  onSuccess,
  className
}: DeleteDialogProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { delete: deleteItem, isDeleting } = useEntityCrud({
    service,
    queryKey,
    entityName,
    onSuccess: {
      delete: (id) => {
        setIsOpen(false);
        onSuccess?.(id);
      }
    }
  });

  const handleDelete = () => {
    deleteItem(itemId);
  };

  const defaultTrigger = (
    <Button variant="destructive" size="sm" className={className}>
      <Trash2 className="h-4 w-4 mr-2" />
      Supprimer
    </Button>
  );

  const defaultTitle = title || `Supprimer ${entityName}`;
  const defaultDescription = description || `Êtes-vous sûr de vouloir supprimer ${itemLabel ? `"${itemLabel}"` : `ce ${entityName}`} ? Cette action est irréversible.`;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{defaultTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
