<script setup lang="ts">
import type { ActiveUser } from '~/types/user'
import type { KanbanTaskItem } from '~/utils/kanban'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  saving?: boolean
  task?: KanbanTaskItem | null
}>()

const emit = defineEmits<{
  save: [payload: {
    description: string
    projectId?: number
    priority?: string
    severity?: string
    expirationDate: Date
    userId?: number
  }]
}>()

const authStore = useAuthStore()
const { $api } = useNuxtApp()
const route = useRoute()
const userIdParam = computed(() => route.params.id as string)

const loading = ref(false)
const description = ref('')
const expirationDate = ref(new Date().toISOString().slice(0, 10))
const projectId = ref<number | undefined>()
const priority = ref<string | undefined>()
const severity = ref<string | undefined>()
const projectOptions = ref<Array<{ label: string, value: number }>>([])

const userTo = ref<number | undefined>()
const team = ref<Array<{ label: string, value: number }>>([])

const priorityOptions = [
  { label: 'Low', value: 'Low' },
  { label: 'Normal', value: 'Normal' },
  { label: 'High', value: 'High' }
]

const severityOptions = [
  { label: 'Wishlist', value: 'Wishlist' },
  { label: 'Minor', value: 'Minor' },
  { label: 'Normal', value: 'Normal' },
  { label: 'Important', value: 'Important' },
  { label: 'Critical', value: 'Critical' }
]

const modalTitle = computed(() => props.task ? 'Editar tarea' : 'Crear tarea')

const loadOptions = async () => {
  loading.value = true

  try {
    if (authStore.currentUser?.admin || authStore.currentUser?.roleAdmin) {
      const users = await $api<Array<{ idUser: number, fullname: string }>>('/users/active')
      team.value = users.map(user => ({
        label: user.fullname,
        value: user.idUser
      }))

      const projects = await $api<Array<{ idProject: number, description: string }>>('/project/active')
      projectOptions.value = projects.map(project => ({
        label: project.description,
        value: project.idProject
      }))
    } else {
      const status = await $api<{ projects?: Record<string, { name: string, id: number }> }>('/users/me/status')
      projectOptions.value = Object.values(status.projects ?? {}).map(project => ({
        label: project.name,
        value: project.id
      }))
    }
  } catch {
    projectOptions.value = []
    team.value = []
  } finally {
    loading.value = false
  }
}

watch(open, async (isOpen) => {
  if (!isOpen) {
    return
  }

  await loadOptions()

  if (props.task) {
    description.value = props.task.title
    expirationDate.value = props.task.date.includes('-')
      ? props.task.date
      : `${props.task.date.slice(0, 4)}-${props.task.date.slice(4, 6)}-${props.task.date.slice(6, 8)}`
    projectId.value = props.task.projectId
    priority.value = props.task.priority
    severity.value = props.task.severity
    userTo.value = Number(userIdParam.value)
  } else {
    description.value = ''
    expirationDate.value = new Date().toISOString().slice(0, 10)
    projectId.value = undefined
    priority.value = undefined
    severity.value = undefined
    userTo.value = Number(userIdParam.value)
  }
})

const submit = () => {
  if (!description.value.trim()) {
    return
  }
  if ((authStore.currentUser?.admin || authStore.currentUser?.roleAdmin) && !userTo.value) {
    return
  }

  emit('save', {
    description: description.value.trim(),
    projectId: projectId.value,
    priority: priority.value,
    severity: severity.value,
    expirationDate: new Date(`${expirationDate.value}T00:00:00`),
    userId: userTo.value
  })
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="modalTitle"
  >
    <template #body>
      <div
        v-if="loading"
        class="space-y-3"
      >
        <USkeleton class="h-10" />
        <USkeleton class="h-24" />
        <USkeleton class="h-10" />
      </div>

      <form
        v-else
        class="space-y-4"
        @submit.prevent="submit"
      >
        <UFormField
          v-if="authStore.currentUser?.admin || authStore.currentUser?.roleAdmin"
          label="Destinatario"
          required
        >
          <USelect
            v-model="userTo"
            :items="team"
            value-key="value"
            label-key="label"
            class="w-full"
            placeholder="Seleccionar destinatario"
          />
        </UFormField>

        <UFormField
          label="Descripción"
          required
        >
          <UTextarea
            v-model="description"
            :rows="4"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Proyecto">
          <USelect
            v-model="projectId"
            :items="projectOptions"
            value-key="value"
            label-key="label"
            class="w-full"
            placeholder="Seleccionar proyecto"
          />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Prioridad">
            <USelect
              v-model="priority"
              :items="priorityOptions"
              value-key="value"
              label-key="label"
              class="w-full"
              placeholder="Seleccionar prioridad"
            />
          </UFormField>

          <UFormField label="Severidad">
            <USelect
              v-model="severity"
              :items="severityOptions"
              value-key="value"
              label-key="label"
              class="w-full"
              placeholder="Seleccionar severidad"
            />
          </UFormField>
        </div>

        <UFormField label="Expira">
          <UInput
            v-model="expirationDate"
            type="date"
            class="w-full"
            :min="new Date().toISOString().slice(0, 10)"
          />
        </UFormField>
      </form>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          label="Cancelar"
          @click="open = false"
        />
        <UButton
          color="primary"
          :label="task ? 'Guardar cambios' : 'Crear tarea'"
          :loading="saving"
          :disabled="!description.trim() || ((authStore.currentUser?.admin || authStore.currentUser?.roleAdmin) && !userTo)"
          @click="submit"
        />
      </div>
    </template>
  </UModal>
</template>
