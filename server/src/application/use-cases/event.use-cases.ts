import { ActivityType } from '@/infrastructure/config/activity.config'
import { EventRepository } from '@/infrastructure/repositories/event.repository'

const eventRepository = new EventRepository()

// Types pour la création et la mise à jour d'un événement
export interface EventCreatePayload {
  title: string;
  image?: string;
  startDate: string;
  endDate: string;
  location: string;
  description?: string;
  creatorId: string;
  categoryId?: string;
  tags?: string[];
}

export interface EventUpdatePayload {
  title?: string;
  image?: string
  startDate?: string
  endDate?: string
  location?: string
  description?: string
  creatorId?: string
  categoryId?: string
  tags?: string[]
}

export class CreateEventUseCase {
  async execute(params: EventCreatePayload) {
    // Conversion des dates string -> Date
    const event = await eventRepository.create({
    ...params,
    title: params.title,
      startDate: new Date(params.startDate),
      endDate: new Date(params.endDate)
    })
    return { success: true, data: event }
  }
  // log() {
  //   return ActivityType.CREATE_EVENT
  // }
}

export class UpdateEventUseCase {
  async execute(id: string, params: EventUpdatePayload) {
    // Conversion conditionnelle des dates string -> Date
    const updateData: any = { ...params }
    if (params.startDate) updateData.startDate = new Date(params.startDate)
    if (params.endDate) updateData.endDate = new Date(params.endDate)
    const event = await eventRepository.update(id, updateData)
    return { success: true, data: event }
  }
  // log() {
  //   return ActivityType.UPDATE_EVENT
  // }
}

export class DeleteEventUseCase {
  async execute(id: string) {
    await eventRepository.delete(id)
    return { success: true }
  }
  // log() {
  //   return ActivityType.DELETE_EVENT
  // }
}

export class GetEventUseCase {
  async execute(id: string) {
    const event = await eventRepository.findById(id)
    if (!event) return { success: false, error: 'Event not found' }
    return { success: true, data: event }
  }
}

export class ListEventsUseCase {
  async execute(params?: { skip?: number; limit?: number }) {
    const { skip = 0, limit = 20 } = params || {}
    const events = await eventRepository.findAll({ skip, limit })
    return { success: true, data: events }
  }
}
