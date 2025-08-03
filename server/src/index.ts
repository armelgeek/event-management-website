import process from 'node:process'
import { App } from './app'
import { PermissionController, UserController } from './infrastructure/controllers'
import { CategoryController } from './infrastructure/controllers/category.controller'
import { EventController } from './infrastructure/controllers/event.controller'
import { TagController } from './infrastructure/controllers/tag.controller'

const app = new App([
  new UserController(),
  new PermissionController(),
  new CategoryController(),
  new EventController(),
  new TagController()
]).getApp()

const port = Number(process.env.PORT) || 3000

console.info(`🚀 Server is running on port ${port}`)
console.info(`📚 API Documentation: http://localhost:${port}/docs`)
console.info(`🔍 OpenAPI Schema: http://localhost:${port}/swagger`)

export default {
  port,
  fetch: app.fetch
}
