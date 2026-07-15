<script setup lang="ts">
import type { ProjectFormPayload } from '~/types/project'

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

onMounted(() => fetchClients())

const projectTypeOptions = [
  { label: 'Tipo 1', value: 1 },
  { label: 'Tipo 2', value: 2 },
  { label: 'Tipo 3', value: 3 }
]

// Campos base
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

// Campos solo para fixed = true (string para compatibilidad con UInput v-model)
const taigaProjectID = ref<string>(String(props.initialData?.taigaProjectID ?? ''))
const taigaSlug = ref<string>(props.initialData?.taigaSlug ?? '')
const taigaConfigurationVerificationId = ref<string>(String(props.initialData?.taigaConfigurationVerificationId ?? ''))
const taigaConfigurationValidationId = ref<string>(String(props.initialData?.taigaConfigurationValidationId ?? ''))
const plannedQuantityHours = ref<string>(String(props.initialData?.plannedQuantityHours ?? ''))
const plannedMilestonesPerMonth = ref<string>(String(props.initialData?.plannedMilestonesPerMonth ?? ''))
const currentBudget = ref<string>(String(props.initialData?.currentBudget ?? ''))

const isValid = computed(() =>
  description.value.trim().length > 0 && idCustomer.value !== undefined
)

// Al cambiar fixed, si es false limpiamos los campos específicos
watch(fixed, (val) => {
  if (!val) {
    taigaProjectID.value = ''
    taigaSlug.value = ''
    taigaConfigurationVerificationId.value = ''
    taigaConfigurationValidationId.value = ''
    plannedQuantityHours.value = ''
    plannedMilestonesPerMonth.value = ''
    currentBudget.value = ''
  }
})

const submit = () => {
  if (!isValid.value || idCustomer.value === undefined) return

  const payload: ProjectFormPayload = {
    description: description.value.trim(),
    active: active.value,
    idCustomer: idCustomer.value,
    projectType: projectType.value,
    fixed: fixed.value,
    continuos: continuos.value,
    fromCyP: fromCyP.value,
    internal: internal.value,
    clockifyID: clockifyID.value.trim() || undefined,
    color: color.value || undefined
  }

  if (fixed.value) {
    payload.taigaProjectID = taigaProjectID.value ? Number(taigaProjectID.value) : null
    payload.taigaSlug = taigaSlug.value.trim() || null
    payload.taigaConfigurationVerificationId = taigaConfigurationVerificationId.value ? Number(taigaConfigurationVerificationId.value) : null
    payload.taigaConfigurationValidationId = taigaConfigurationValidationId.value ? Number(taigaConfigurationValidationId.value) : null
    payload.plannedQuantityHours = plannedQuantityHours.value ? Number(plannedQuantityHours.value) : null
    payload.plannedMilestonesPerMonth = plannedMilestonesPerMonth.value ? Number(plannedMilestonesPerMonth.value) : null
    payload.currentBudget = currentBudget.value ? Number(currentBudget.value) : null
  }

  emit('submit', payload)
}
</script>

<template>
  <form
    class="space-y-6"
    @submit.prevent="submit"
  >
    <!-- ── Datos básicos ──────────────────────────────────────────────── -->
    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
        Datos del proyecto
      </h3>
      <USeparator />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Descripción"
        required
        class="sm:col-span-2"
      >
        <UInput
          v-model="description"
          placeholder="Ej: Portal de Clientes"
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
        label="Tipo de proyecto"
        class="sm:col-span-1"
      >
        <USelect
          v-model="projectType"
          :items="projectTypeOptions"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Clockify ID"
        class="sm:col-span-1"
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

    <!-- ── Configuración ─────────────────────────────────────────────── -->
    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
        Configuración
      </h3>
      <USeparator />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField label="Activo">
        <div class="flex items-center gap-3 pt-1">
          <UToggle v-model="active" />
          <span class="text-sm text-muted">{{ active ? 'Activo' : 'Inactivo' }}</span>
        </div>
      </UFormField>

      <UFormField label="Tipo fijo">
        <div class="flex items-center gap-3 pt-1">
          <UToggle v-model="fixed" />
          <span class="text-sm text-muted">{{ fixed ? 'Fijo' : 'No fijo' }}</span>
        </div>
      </UFormField>

      <UFormField label="Continuo">
        <div class="flex items-center gap-3 pt-1">
          <UToggle v-model="continuos" />
          <span class="text-sm text-muted">{{ continuos ? 'Sí' : 'No' }}</span>
        </div>
      </UFormField>

      <UFormField label="Interno">
        <div class="flex items-center gap-3 pt-1">
          <UToggle v-model="internal" />
          <span class="text-sm text-muted">{{ internal ? 'Sí' : 'No' }}</span>
        </div>
      </UFormField>

      <UFormField label="CyP">
        <div class="flex items-center gap-3 pt-1">
          <UToggle v-model="fromCyP" />
          <span class="text-sm text-muted">{{ fromCyP ? 'Sí' : 'No' }}</span>
        </div>
      </UFormField>
    </div>

    <!-- ── Integración Taiga (solo fixed) ────────────────────────────── -->
    <template v-if="fixed">
      <div class="space-y-1">
        <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
          Integración Taiga
        </h3>
        <USeparator />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField label="ID Taiga" class="sm:col-span-1">
          <UInput
            v-model="taigaProjectID"
            type="number"
            placeholder="Ej: 34"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Slug Taiga" class="sm:col-span-1">
          <UInput
            v-model="taigaSlug"
            placeholder="Ej: seguimiento-comercial"
            class="w-full font-mono"
          />
        </UFormField>

        <UFormField label="ID Verificación" class="sm:col-span-1">
          <UInput
            v-model="taigaConfigurationVerificationId"
            type="number"
            placeholder="Ej: 72"
            class="w-full"
          />
        </UFormField>

        <UFormField label="ID Validación" class="sm:col-span-1">
          <UInput
            v-model="taigaConfigurationValidationId"
            type="number"
            placeholder="Ej: 88"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- ── Planificación (solo fixed) ──────────────────────────────── -->
      <div class="space-y-1">
        <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
          Planificación
        </h3>
        <USeparator />
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <UFormField label="Horas planificadas" class="sm:col-span-1">
          <UInput
            v-model="plannedQuantityHours"
            type="number"
            placeholder="Ej: 60"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Milestones por mes" class="sm:col-span-1">
          <UInput
            v-model="plannedMilestonesPerMonth"
            type="number"
            placeholder="Ej: 2"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Presupuesto actual" class="sm:col-span-1">
          <UInput
            v-model="currentBudget"
            type="number"
            placeholder="Ej: 80"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>

    <!-- ── Acciones ────────────────────────────────────────────────────── -->
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
