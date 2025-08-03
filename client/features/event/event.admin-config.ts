import { eventSchema } from './event.schema';
import { createAdminEntity, registerAdminEntity } from '@/shared/lib/admin/admin-generator';
import { eventCrudService } from './event.service';
export const EventAdminConfig = createAdminEntity('event', eventSchema, {
  icon: '🎉',
  actions: { create: true, read: true, update: true, delete: true, bulk: true },
  services: eventCrudService,
  queryKey: ['events'],
  parent: undefined,
  parseEditItem: (item) => {
    return {
      ...item,
      image: item.image ? item.image : '',
      startDate: item.startDate ? new Date(item.startDate) : undefined,
      endDate: item.endDate ? new Date(item.endDate) : undefined,
    };
  },
  formFields: [
    'name',
    'startDate', 
    'endDate',
    'location',
    'description',
    'image',
    'categoryId',
    'tags'
  ],
  ui: {
    form: {
      layout: 'free',
    }
  },
  fieldOverrides: {
    name: { 
      display: { 
        layout: 'full',
        order: 1 
      } 
    },
    startDate: { 
      type: 'date',
      display: { 
        layout: 'half',
        order: 2 
      } 
    },
    endDate: { 
      type: 'date',
      display: { 
        layout: 'half',
        order: 3 
      } 
    },
    location: { 
      display: { 
        layout: 'full',
        order: 4 
      } 
    },
    description: { 
      display: { 
        layout: 'full',
        order: 5 
      } 
    },
    tags: {
      display: { 
        layout: 'auto',
        order: 8 
      }
    },
    image: {
      display: {
        layout: 'half',
        order: 6 
      } 
    },
    categoryId: {
      display: {
        layout: 'auto',
        order: 7
      }
    }
  }
});


registerAdminEntity(
  'event',
  EventAdminConfig,
  '/admin/events-crud',
  '🎉',
  3
)

