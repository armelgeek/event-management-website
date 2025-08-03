"use client";

import { CreateForm } from '@/shared/components/atoms/crud';
import { eventSchema } from '@/features/event/event.schema';
import { EventAdminConfig } from '@/features/event/event.admin-config';

export default function CreateEventPage() {


    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <CreateForm
                schema={eventSchema}
                config={EventAdminConfig}
                queryKey={['events']}
                redirectTo="/events"
                title="Créer un nouvel événement"
                description="Remplissez les informations ci-dessous pour créer un événement"
            />
        </div>
    );
}
