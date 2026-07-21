<script setup lang="ts">
import type { ProjectFormPayload } from '~/types/project'

definePageMeta({ roles: ['admin'] })

const route = useRoute()
const projectId = computed(() => Number(route.params.id))

const { saving, fetchProject, updateProject } = useProjectsManagment()

const loadingProject = ref(true)
const project = ref<Awaited<ReturnType<typeof fetchProject>>>(null)

onMounted(async () => {
  project.value = await fetchProject(projectId.value)
  loadingProject.value = false

  if (project.value) {
    usePageTitle(`Editar — ${project.value.description}`)
  }
})

const initialData = computed((): Partial<ProjectFormPayload> | undefined => {
  if (!project.value) return undefined
  const p = project.value
  return {
    description: p.description,
    active: p.active,
    idCustomer: p.customer?.idCustomer,
    projectType: p.projectType,
    fixed: p.fixed,
    continuos: p.continuos,
    fromCyP: p.fromCyP,
    internal: p.internal,
    clockifyID: p.clockifyID ?? '',
    color: p.color ?? '',
    // Campos fixed — usa as any para acceder sin discriminar union
    taigaProjectID: (p as any).taigaProjectID ?? undefined,
    taigaSlug: (p as any).taigaSlug ?? undefined,
    taigaConfigurationVerificationId: (p as any).taigaConfigurationVerificationId ?? undefined,
    taigaConfigurationValidationId: (p as any).taigaConfigurationValidationId ?? undefined,
    plannedQuantityHours: (p as any).plannedQuantityHours ?? undefined,
    plannedMilestonesPerMonth: (p as any).plannedMilestonesPerMonth ?? undefined,
    currentBudget: (p as any).currentBudget ?? undefined
  }
})

const handleSubmit = async (payload: ProjectFormPayload) => {
  const ok = await updateProject(projectId.value, payload)
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
      <SectionTitle title="Editar Proyecto" />
    </div>

    <!-- Loading -->
    <UCard v-if="loadingProject">
      <div class="space-y-4">
        <USkeleton class="h-10" />
        <USkeleton class="h-10" />
        <USkeleton class="h-24" />
      </div>
    </UCard>

    <!-- Not found -->
    <UAlert
      v-else-if="!project"
      color="error"
      variant="subtle"
      title="Proyecto no encontrado"
      description="No se encontró un proyecto con ese ID."
    />

    <!-- Form -->
    <UCard v-else>
      <ProjectForm
        mode="edit"
        :saving="saving"
        :initial-data="initialData ?? undefined"
        @submit="handleSubmit"
        @cancel="navigateTo('/admin/projects')"
      />
    </UCard>
  </div>
</template>
