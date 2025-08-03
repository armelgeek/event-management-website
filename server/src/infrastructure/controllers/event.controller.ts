import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import {
  CreateEventUseCase,
  DeleteEventUseCase,
  GetEventUseCase,
  ListEventsUseCase,
  UpdateEventUseCase
} from '@/application/use-cases/event.use-cases'
import type { Routes } from '@/domain/types/route.type'

export class EventController implements Routes {
  public controller: OpenAPIHono

  private listEvents = new ListEventsUseCase()
  private getEvent = new GetEventUseCase()
  private createEvent = new CreateEventUseCase()
  private updateEvent = new UpdateEventUseCase()
  private deleteEvent = new DeleteEventUseCase()

  private CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
  })
  private TagSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
  })
  private EventSchema = z.object({
    id: z.string().openapi({ example: 'evt_ABC123' }),
    title: z.string().openapi({ example: 'Conférence IA 2025' }),
    image: z.string().optional().openapi({ example: 'https://cdn.com/image.jpg' }),
    startDate: z.string().openapi({ example: '2025-08-10T09:00:00.000Z' }),
    endDate: z.string().openapi({ example: '2025-08-10T18:00:00.000Z' }),
    location: z.string().openapi({ example: 'Paris, France' }),
    description: z.string().optional().openapi({ example: "Un événement sur l'IA." }),
    creatorId: z.string().openapi({ example: 'user_123' }),
    categoryId: z.string().optional().openapi({ example: 'cat_123' }),
    category: this.CategorySchema.optional(),
    tags: z.array(this.TagSchema).optional(),
    createdAt: z.string().openapi({ example: '2025-08-01T12:00:00.000Z' }),
    updatedAt: z.string().openapi({ example: '2025-08-01T12:00:00.000Z' })
  })
  private CreateEventSchema = this.EventSchema.omit({
    id: true,
    createdAt: true,
    creatorId: true,
    updatedAt: true,
    category: true,
    tags: true
  })
  private UpdateEventSchema = this.CreateEventSchema.partial()

  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }

  public initRoutes() {
    // GET /events
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/events',
        tags: ['Events'],
        summary: 'Liste paginée des événements',
        description: 'Récupère la liste paginée des événements',
        operationId: 'listEvents',
        request: {
          query: z.object({
            skip: z.string().optional(),
            limit: z.string().optional()
          })
        },
        responses: {
          200: {
            description: 'Liste des événements',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.array(this.EventSchema),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const skip = Number(c.req.query('skip') ?? '0')
        const limit = Number(c.req.query('limit') ?? '20')
        const result = await this.listEvents.execute({ skip, limit })
        return c.json(result)
      }
    )

    // GET /events/:id
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/events/:id',
        tags: ['Events'],
        summary: "Détail d'un événement",
        description: 'Récupère un événement par son identifiant',
        operationId: 'getEvent',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: "Détail de l'événement",
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: this.EventSchema.optional(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const id = c.req.param('id')
        const result = await this.getEvent.execute(id)
        return c.json(result)
      }
    )

    // POST /events
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/events',
        tags: ['Events'],
        summary: 'Créer un événement',
        description: 'Crée un nouvel événement',
        operationId: 'createEvent',
        request: {
          body: {
            content: {
              'application/json': {
                schema: this.CreateEventSchema
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Événement créé',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: this.EventSchema.optional(),
                  error: z.string().optional()
                })
              }
            }
          },
          400: {
            description: 'Erreur de validation',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  error: z.any()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const body = await c.req.json()
        const currentUser = c.get('user')
        if (!currentUser) {
          return c.json({ success: false, error: 'Unauthorized' }, 401)
        }

        const parse = this.CreateEventSchema.safeParse(body)
        if (!parse.success) {
          return c.json({ success: false, error: parse.error.flatten() }, 400)
        }
        const result = await this.createEvent.execute({
          ...parse.data,
          creatorId: currentUser.id
        })
        if (result.success && result.data?.id) {
          // Retourne l'event enrichi (catégorie/tags)
          const enriched = await this.getEvent.execute(result.data.id)
          return c.json(enriched, 201)
        }
        return c.json(result, 400)
      }
    )

    // PATCH /events/:id
    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/events/:id',
        tags: ['Events'],
        summary: 'Mettre à jour un événement',
        description: 'Met à jour un événement existant',
        operationId: 'updateEvent',
        request: {
          params: z.object({ id: z.string() }),
          body: {
            content: {
              'application/json': {
                schema: this.UpdateEventSchema
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Événement mis à jour',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: this.EventSchema.optional(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const id = c.req.param('id')
        const body = await c.req.json()
        const result = await this.updateEvent.execute(id, body)
        if (result.success && result.data?.id) {
          // Retourne l'event enrichi (catégorie/tags)
          const enriched = await this.getEvent.execute(result.data.id)
          return c.json(enriched)
        }
        return c.json(result)
      }
    )

    // DELETE /events/:id
    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/events/:id',
        tags: ['Events'],
        summary: 'Supprimer un événement',
        description: 'Supprime un événement existant',
        operationId: 'deleteEvent',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Événement supprimé',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.any().optional(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const id = c.req.param('id')
        const result = await this.deleteEvent.execute(id)
        return c.json(result)
      }
    )
  }

  getRoutes() {
    return this.controller
  }
}
