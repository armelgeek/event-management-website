"use client";
import { tagSchema } from '@/features/tag/tag.schema'
import { TagAdminConfig } from '@/features/tag/tag.admin-config'
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page'

export default function TagAdminPage() {
  return (
    <SimpleAdminPage
      config={TagAdminConfig}
      schema={tagSchema}
    />
  )
}
