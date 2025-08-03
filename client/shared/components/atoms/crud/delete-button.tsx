"use client";

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/atoms/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/atoms/ui/alert-dialog';

interface DeleteButtonProps {
  service: {
    remove: (id: string) => Promise<{ success: boolean }>;
  };
  queryKey: string[];
  itemId: string;
  itemLabel?: string;
  onSuccess?: () => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  children?: React.ReactNode;
}

export function DeleteButton({
  service,
  queryKey,
  itemId,
  itemLabel = 'cet élément',
  onSuccess,
  size = 'sm',
  variant = 'destructive',
  className,
  children
}: DeleteButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => service.remove(itemId),
    onSuccess: () => {
      toast.success('Élément supprimé avec succès');
      queryClient.invalidateQueries({ queryKey });
      setIsDialogOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        className={className}
        onClick={() => setIsDialogOpen(true)}
        disabled={deleteMutation.isPending}
      >
        {children || (
          <>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Supprimer</span>
          </>
        )}
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {itemLabel} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
