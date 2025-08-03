import { useQuery } from '@tanstack/react-query';
import type { Event } from '../event.admin-config';

// Données mock
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Conférence Tech 2025',
    description: 'La plus grande conférence technologique de l\'année avec des speakers internationaux.',
    organizer: 'TechCorp',
    startDate: '2025-09-15T09:00:00Z',
    endDate: '2025-09-15T18:00:00Z',
    location: 'Paris Convention Center',
    price: 150,
    maxAttendees: 500,
    currentAttendees: 342,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    tags: ['technologie', 'innovation', 'développement'],
    status: 'published',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-02-01T14:30:00Z',
  },
  {
    id: '2',
    title: 'Workshop React Avancé',
    description: 'Apprenez les techniques avancées de React avec des experts du domaine.',
    organizer: 'DevSchool',
    startDate: '2025-08-20T14:00:00Z',
    endDate: '2025-08-20T17:00:00Z',
    location: 'Online',
    price: 75,
    maxAttendees: 50,
    currentAttendees: 23,
    category: 'formation',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    tags: ['react', 'frontend', 'workshop'],
    status: 'published',
    createdAt: '2025-01-20T11:00:00Z',
    updatedAt: '2025-01-25T16:00:00Z',
  },
  {
    id: '3',
    title: 'Networking Startup',
    description: 'Rencontrez d\'autres entrepreneurs et développez votre réseau professionnel.',
    organizer: 'StartupHub',
    startDate: '2025-08-30T19:00:00Z',
    endDate: '2025-08-30T22:00:00Z',
    location: 'Café Central, Lyon',
    price: 0,
    maxAttendees: 100,
    currentAttendees: 67,
    category: 'networking',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    tags: ['networking', 'startup', 'business'],
    status: 'published',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-30T10:00:00Z',
  },
  {
    id: '4',
    title: 'Formation UX/UI Design',
    description: 'Maîtrisez les principes fondamentaux du design d\'interface utilisateur.',
    organizer: 'Design Academy',
    startDate: '2025-09-10T10:00:00Z',
    endDate: '2025-09-10T16:00:00Z',
    location: 'Studio Design, Marseille',
    price: 120,
    maxAttendees: 30,
    currentAttendees: 18,
    category: 'design',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
    tags: ['design', 'ux', 'ui', 'formation'],
    status: 'published',
    createdAt: '2025-01-25T12:00:00Z',
    updatedAt: '2025-02-02T09:00:00Z',
  },
];

export function useEvents(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      // Simulation d'un appel API avec filtrage basique
      let filteredEvents = [...mockEvents];

      if (filters?.search) {
        const search = filters.search as string;
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase()) ||
          event.organizer.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (filters?.category) {
        filteredEvents = filteredEvents.filter(event => event.category === filters.category);
      }

      if (filters?.status) {
        filteredEvents = filteredEvents.filter(event => event.status === filters.status);
      }

      return {
        data: filteredEvents,
        meta: {
          total: filteredEvents.length,
          totalPages: Math.ceil(filteredEvents.length / 12),
          page: 1,
          limit: 12
        }
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
