<script setup lang="ts">
import type { AdminProjectFormPayload } from '~/types/project'

const props = defineProps<{
  mode: 'create' | 'edit'
  saving?: boolean
  initialData?: Partial<AdminProjectFormPayload>
}>()

const emit = defineEmits<{
  submit: [payload: AdminProjectFormPayload]
  cancel: []
}>()

const name = ref(props.initialData?.name ?? '')
const description = ref(props.initialData?.description ?? '')
const active = ref(props.initialData?.active ?? true)
const idTaigaProject = ref<number | string>(props.initialData?.idTaigaProject ?? '')
const slug = ref(props.initialData?.slug ?? '')

const isValid = computed(() => name.value.trim().length > 0)

const submit = () => {
  if (!isValid.value) return

  emit('submit', {
    name: name.value.trim(),
    description: description.value.trim() || undefined,
    active: active.value,
    idTaigaProject: idTaigaProject.value ? Number(idTaigaProject.value) : null,
    slug: slug.value.trim() || undefined
  })
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
        label="Nombre"
        required
        class="sm:col-span-2"
      >
        <UInput
          v-model="name"
          placeholder="Ej: Portal de Clientes"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Slug"
        class="sm:col-span-1"
        hint="Identificador único URL-friendly"
      >
        <UInput
          v-model="slug"
          placeholder="Ej: portal-clientes"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="ID Taiga"
        class="sm:col-span-1"
      >
        <UInput
          v-model="idTaigaProject"
          type="number"
          placeholder="Ej: 42"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Descripción"
        class="sm:col-span-2"
      >
        <UTextarea
          v-model="description"
          placeholder="Descripción breve del proyecto..."
          :rows="3"
          class="w-full"
        />
      </UFormField>
    </div>

    <!-- ── Estado ─────────────────────────────────────────────────────── -->
    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
        Estado
      </h3>
      <USeparator />
    </div>

    <UFormField label="Activo">
      <div class="flex items-center gap-3 pt-1">
        <UToggle v-model="active" />
        <span class="text-sm text-muted">
          {{ active ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
    </UFormField>

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
