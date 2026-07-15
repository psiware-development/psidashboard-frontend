<script setup lang="ts">
import type { ProjectFormPayload } from '~/types/project'

definePageMeta({ roles: ['admin'] })
usePageTitle('Nuevo proyecto')

const { saving, createProject } = useProjectsManagment()

const handleSubmit = async (payload: ProjectFormPayload) => {
  const ok = await createProject(payload)
  if (ok) {
    await navigateTo('/admin/projects')
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-[800px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <div class="flex items-center gap-3">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        to="/admin/projects"
        aria-label="Volver al listado"
      />
      <SectionTitle title="Nuevo proyecto" />
    </div>

    <UCard>
      <ProjectForm
        mode="create"
        :saving="saving"
        @submit="handleSubmit"
        @cancel="navigateTo('/admin/projects')"
      />
    </UCard>
  </div>
</template>
