import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { CreateTagUseCase } from '@/application/use-cases/tag/create-tag.use-case'
import { DeleteTagUseCase } from '@/application/use-cases/tag/delete-tag.use-case'
import { GetAllTagsUseCase } from '@/application/use-cases/tag/get-all-tags.use-case'
import { GetTagByIdUseCase } from '@/application/use-cases/tag/get-tag-by-id.use-case'
import { UpdateTagUseCase } from '@/application/use-cases/tag/update-tag.use-case'
import type { Routes } from '@/domain/types/route.type'
import { TagRepositoryImpl } from '../repositories/tag.repository'

export class TagController implements Routes {
  public controller: OpenAPIHono

  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }

  private tagRepo = new TagRepositoryImpl()
  private getAllTags = new GetAllTagsUseCase(this.tagRepo)
  private getTagById = new GetTagByIdUseCase(this.tagRepo)
  private createTag = new CreateTagUseCase(this.tagRepo)
  private updateTag = new UpdateTagUseCase(this.tagRepo)
  private deleteTag = new DeleteTagUseCase(this.tagRepo)

  private TagSchema = z.object({
    id: z.string().openapi({ example: 'tag_ABC123' }),
    name: z.string().openapi({ example: 'React' }),
    description: z.string().optional().openapi({ example: 'Tag pour ReactJS' }),
    createdAt: z.string().openapi({ example: '2025-05-06T16:34:49.937Z' }),
    updatedAt: z.string().openapi({ example: '2025-05-06T16:34:49.937Z' })
  })
  private CreateTagSchema = this.TagSchema.omit({ id: true, createdAt: true, updatedAt: true })
  private UpdateTagSchema = this.CreateTagSchema.partial()

  public initRoutes() {
    // GET /tags
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/tags',
        tags: ['Tags'],
        summary: 'Get all tags',
        description: 'Récupère la liste paginée des tags',
        operationId: 'getAllTags',
        request: {
          query: z.object({
            page: z.string().optional(),
            limit: z.string().optional()
          })
        },
        responses: {
          200: {
            description: 'Liste des tags',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z
                    .object({
                      data: z.array(this.TagSchema),
                      total: z.number(),
                      page: z.number(),
                      limit: z.number(),
                      totalPages: z.number()
                    })
                    .optional(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const page = Number(c.req.query('page') ?? '1')
        const limit = Number(c.req.query('limit') ?? '10')
        const result = await this.getAllTags.execute(page, limit)
        return c.json(result)
      }
    )

    // GET /tags/:id
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/tags/:id',
        tags: ['Tags'],
        summary: 'Get tag by ID',
        description: 'Récupère un tag par son identifiant',
        operationId: 'getTagById',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Tag par ID',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: this.TagSchema.optional(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const id = c.req.param('id')
        const result = await this.getTagById.execute(id)
        return c.json(result)
      }
    )

    // POST /tags
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/tags',
        tags: ['Tags'],
        summary: 'Create a new tag',
        description: 'Crée un nouveau tag',
        operationId: 'createTag',
        request: {
          body: {
            content: {
              'application/json': {
                schema: this.CreateTagSchema
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Tag créé',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: this.TagSchema.optional(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const body = await c.req.json()
        const result = await this.createTag.execute(body)
        return c.json(result)
      }
    )

    // PUT /tags/:id
    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/tags/:id',
        tags: ['Tags'],
        summary: 'Update a tag',
        description: 'Met à jour un tag',
        operationId: 'updateTag',
        request: {
          params: z.object({ id: z.string() }),
          body: {
            content: {
              'application/json': {
                schema: this.UpdateTagSchema
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Tag mis à jour',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: this.TagSchema.optional(),
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
        const result = await this.updateTag.execute(id, body)
        return c.json(result)
      }
    )

    // DELETE /tags/:id
    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/tags/:id',
        tags: ['Tags'],
        summary: 'Delete a tag',
        description: 'Supprime un tag',
        operationId: 'deleteTag',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Tag supprimé',
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
        const result = await this.deleteTag.execute(id)
        return c.json(result)
      }
    )
  }

  getRoutes() {
    return this.controller
  }
}
