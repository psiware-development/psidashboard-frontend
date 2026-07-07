<script setup lang="ts">
definePageMeta({
  layout: 'login'
})

usePageTitle('Registrarse')

const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const register = async () => {
  if (password.value !== passwordConfirm.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  if (!username.value.trim() || !email.value.trim() || !password.value) {
    error.value = 'Completá todos los campos.'
    return
  }

  loading.value = true
  error.value = null

  try {
    await authStore.register({
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
      passwordConfirm: passwordConfirm.value
    })
    await navigateTo('/')
  } catch {
    error.value = 'Ha ocurrido un error al registrarse.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <AppSiteLogo />
      <h1 class="text-2xl font-semibold tracking-tight text-highlighted">
        Crear cuenta
      </h1>
      <p class="text-sm text-muted">
        Completá tus datos para registrarte.
      </p>
    </header>

    <div class="space-y-5">
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="error"
      />

      <form
        class="space-y-5"
        @submit.prevent="register"
      >
        <UFormField
          label="Usuario"
          required
        >
          <UInput
            v-model="username"
            size="lg"
            placeholder="Tu usuario"
            autocomplete="username"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <UFormField
          label="Email"
          required
        >
          <UInput
            v-model="email"
            type="email"
            size="lg"
            placeholder="tu@email.com"
            autocomplete="email"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <UFormField
          label="Contraseña"
          required
        >
          <UInput
            v-model="password"
            type="password"
            size="lg"
            placeholder="••••••••"
            autocomplete="new-password"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <UFormField
          label="Repetir contraseña"
          required
        >
          <UInput
            v-model="passwordConfirm"
            type="password"
            size="lg"
            placeholder="••••••••"
            autocomplete="new-password"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="lg"
          label="Registrarse"
          :loading="loading"
        />
      </form>

      <p class="text-sm text-muted text-center">
        ¿Ya tenés cuenta?
        <NuxtLink
          to="/login"
          class="text-primary hover:underline"
        >
          Ingresar
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
