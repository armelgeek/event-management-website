"use client";
import { EventAdminConfig } from '@/features/event/event.admin-config';
import { eventSchema } from '@/features/event/event.schema';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function EventAdminPage() {
  return (
    <SimpleAdminPage
      config={EventAdminConfig}
      schema={eventSchema}
    />
  );
}
