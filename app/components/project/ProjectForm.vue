<script setup lang="ts">
import type { ProjectFormPayload, TaigaTeamMapPayload } from '~/types/project'

const props = defineProps<{
  mode: 'create' | 'edit'
  saving?: boolean
  initialData?: Partial<ProjectFormPayload>
}>()

const emit = defineEmits<{
  submit: [payload: ProjectFormPayload]
  cancel: []
}>()

const { clientOptions, fetchClients } = useClientsManagment()
const { users, fetchUsers, loading: loadingUsers } = useUserManagement()
const { fetchProjects, isProjectNameTaken } = useProjectsManagment()

onMounted(() => {
  fetchClients()
  fetchProjects()
  if (props.mode === 'create') {
    fetchUsers()
  }
})

const projectTypeOptions = [
  { label: 'Fixed', value: 1 },
  { label: 'Continuo', value: 2 },
  { label: 'Interno', value: 3 }
]

const description = ref(props.initialData?.description ?? '')
const active = ref(props.initialData?.active ?? true)
const idCustomer = ref<number | undefined>(props.initialData?.idCustomer)
const projectType = ref<number>(props.initialData?.projectType ?? 2)
const fixed = ref(props.initialData?.fixed ?? false)
const continuos = ref(props.initialData?.continuos ?? true)
const fromCyP = ref(props.initialData?.fromCyP ?? false)
const internal = ref(props.initialData?.internal ?? false)
const clockifyID = ref(props.initialData?.clockifyID ?? '')
const color = ref(props.initialData?.color ?? '#6366f1')
const initializeTaiga = ref(false)
const selectedCollaborators = ref<number[]>([])
const teamMap = ref<TaigaTeamMapPayload>({})

const isNameDuplicate = computed(() => {
  const name = description.value.trim()

  const initialName = props.initialData?.description?.trim().toLowerCase()
  if (props.mode === 'edit' && initialName && name.toLowerCase() === initialName) {
    return false
  }

  return isProjectNameTaken(name)
})

const isValid = computed(() =>
  description.value.trim().length > 0 && idCustomer.value !== undefined && !isNameDuplicate.value
)

const submit = () => {
  if (!isValid.value || idCustomer.value === undefined) return

  const payload: ProjectFormPayload = {
    description: description.value.trim(),
    active: active.value,
    customer: { idCustomer: idCustomer.value },
    projectType: projectType.value,
    fixed: fixed.value,
    continuos: continuos.value,
    fromCyP: fromCyP.value,
    internal: internal.value,
    clockifyID: clockifyID.value.trim() || undefined,
    color: color.value || undefined,
    initializeTaiga: props.mode === 'create' ? initializeTaiga.value : undefined,
    collaborators: props.mode === 'create' && initializeTaiga.value && selectedCollaborators.value.length > 0
      ? selectedCollaborators.value
      : undefined,
    teamMap: props.mode === 'create' && initializeTaiga.value && Object.keys(teamMap.value).length > 0
      ? teamMap.value
      : undefined
  }

  emit('submit', payload)
}
</script>

<template>
  <form
    class="space-y-6"
    @submit.prevent="submit"
  >
    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
        Datos del proyecto
      </h3>
      <USeparator />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Nombre"
        required
        :error="isNameDuplicate ? 'Ya existe un proyecto con este nombre' : undefined"
        class="sm:col-span-2"
      >
        <UInput
          v-model="description"
          placeholder="Ej: Portal de Clientes"
          :color="isNameDuplicate ? 'error' : undefined"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Cliente"
        required
        class="sm:col-span-2"
      >
        <USelect
          v-model="idCustomer"
          :items="clientOptions"
          placeholder="Seleccionar cliente..."
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Clockify ID"
        class="sm:col-span-2"
      >
        <UInput
          v-model="clockifyID"
          placeholder="Ej: 626bcea03b017d654e7a5586"
          class="w-full font-mono"
        />
      </UFormField>

      <UFormField
        label="Color"
        class="sm:col-span-1"
      >
        <div class="flex items-center gap-3">
          <input
            v-model="color"
            type="color"
            class="h-9 w-16 cursor-pointer rounded border border-default bg-transparent p-0.5"
          >
          <UInput
            v-model="color"
            placeholder="#6366f1"
            class="flex-1 font-mono"
          />
        </div>
      </UFormField>
    </div>

    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
        Configuración
      </h3>
      <USeparator />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Tipo de proyecto"
        required
        class="sm:col-span-2"
      >
        <USelect
          v-model="projectType"
          :items="projectTypeOptions"
          class="w-full"
        />
      </UFormField>

      <UCheckbox
        v-model="active"
        label="Activo"
      />

      <template v-if="mode === 'create'">
        <div class="sm:col-span-2 flex items-center justify-between py-2 border-t border-default/40">
          <div class="space-y-0.5">
            <label class="text-sm font-medium text-highlighted block">
              Integración con Taiga
            </label>
          </div>
          <USwitch
            v-model="initializeTaiga"
            label="Crear proyecto en Taiga"
          />
        </div>

        <div
          v-if="initializeTaiga"
          class="sm:col-span-2 pt-2"
        >
          <ProjectCollaboratorCarousel
            :users="users"
            :selected-user-ids="selectedCollaborators"
            :loading="loadingUsers"
            @update:selected-user-ids="selectedCollaborators = $event"
            @update:team-map="teamMap = $event"
          />
        </div>
      </template>
    </div>

    <div class="flex items-center justify-end gap-3 pt-2">
      <UButton
        color="neutral"
        variant="ghost"
        label="Cancelar"
        type="button"
        @click="emit('cancel')"
      />
      <UButton
        color="primary"
        :label="mode === 'create' ? 'Crear proyecto' : 'Guardar cambios'"
        :loading="saving"
        :disabled="!isValid"
        type="submit"
      />
    </div>
  </form>
</template>
