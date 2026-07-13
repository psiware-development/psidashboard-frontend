<script setup lang="ts">
import type { UserMainRole, UserFormPayload } from '~/types/user'

const props = defineProps<{
  mode: 'create' | 'edit'
  saving?: boolean
  roles: UserMainRole[]
  initialData?: Partial<UserFormPayload & { username: string }>
}>()

const emit = defineEmits<{
  submit: [payload: UserFormPayload]
  cancel: []
}>()

const username = ref(props.initialData?.username ?? '')
const fullname = ref(props.initialData?.fullname ?? '')
const email = ref(props.initialData?.email ?? '')
const password = ref('')
const confirmPassword = ref('')
const idRole = ref<number | undefined>(props.initialData?.idRole)
const idTaigaUser = ref<number | string>(props.initialData?.idTaigaUser ?? '')
const gitHubLogin = ref(props.initialData?.gitHubLogin ?? '')
const roleSM = ref(props.initialData?.roleSM ?? false)
const roleAdmin = ref(props.initialData?.roleAdmin ?? false)

const passwordMismatch = computed(() =>
  password.value && confirmPassword.value && password.value !== confirmPassword.value
)

const isValid = computed(() => {
  const baseValid = username.value.trim() && fullname.value.trim() && email.value.trim()
  if (props.mode === 'create') {
    return baseValid && password.value.trim() && !passwordMismatch.value
  }
  if (password.value) {
    return baseValid && !passwordMismatch.value
  }
  return baseValid
})

const roleOptions = computed(() =>
  props.roles.map(r => ({ label: r.description, value: r.idRole }))
)

const submit = () => {
  if (!isValid.value) return

  emit('submit', {
    username: username.value.trim(),
    fullname: fullname.value.trim(),
    email: email.value.trim(),
    password: password.value || undefined,
    idRole: idRole.value,
    idTaigaUser: idTaigaUser.value ? Number(idTaigaUser.value) : null,
    gitHubLogin: gitHubLogin.value.trim() || undefined,
    roleSM: roleSM.value,
    roleAdmin: roleAdmin.value
  })
}
</script>

<template>
  <form
    class="space-y-6"
    @submit.prevent="submit"
  >
    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
        Datos básicos
      </h3>
      <USeparator />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Nombre completo"
        required
      >
        <UInput
          v-model="fullname"
          placeholder="Ej: Juan Pérez"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Nombre de usuario"
        required
      >
        <UInput
          v-model="username"
          placeholder="Ej: juan.perez"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Email"
        required
        class="sm:col-span-2"
      >
        <UInput
          v-model="email"
          type="email"
          placeholder="Ej: juan.perez@empresa.com"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
        {{ mode === 'create' ? 'Contraseña' : 'Cambiar contraseña' }}
      </h3>
      <p
        v-if="mode === 'edit'"
        class="text-xs text-muted"
      >
        Dejá en blanco para mantener la contraseña actual.
      </p>
      <USeparator />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Contraseña"
        :required="mode === 'create'"
      >
        <UInput
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Confirmar contraseña"
        :required="mode === 'create'"
        :error="passwordMismatch ? 'Las contraseñas no coinciden' : undefined"
      >
        <UInput
          v-model="confirmPassword"
          type="password"
          placeholder="••••••••"
          class="w-full"
          :color="passwordMismatch ? 'error' : undefined"
        />
      </UFormField>
    </div>

    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
        Rol y permisos
      </h3>
      <USeparator />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Rol principal"
        class="sm:col-span-2"
      >
        <USelect
          v-model="idRole"
          :items="roleOptions"
          placeholder="Seleccionar rol"
          class="w-full"
        />
      </UFormField>

      <UCheckbox
        v-model="roleSM"
        label="Es Scrum Master"
      />

      <UCheckbox
        v-model="roleAdmin"
        label="Es Administrador"
      />
    </div>

    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wide">
        Integraciones
      </h3>
      <USeparator />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField label="ID Taiga">
        <UInput
          v-model="idTaigaUser"
          type="number"
          placeholder="Ej: 281"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Nombre de Usuario de GitHub">
        <UInput
          v-model="gitHubLogin"
          placeholder="Ej: juan.perez-empresa"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="flex items-center justify-end gap-3 pt-2">
      <UButton
        color="neutral"
        variant="ghost"
        label="Cancelar"
        type="button"
        class="cursor-pointer"
        @click="emit('cancel')"
      />
      <UButton
        color="primary"
        :label="mode === 'create' ? 'Crear usuario' : 'Guardar cambios'"
        :loading="saving"
        :disabled="!isValid"
        class="cursor-pointer"
        type="submit"
      />
    </div>
  </form>
</template>
