<script setup lang="ts">
definePageMeta({
  layout: 'login'
})

usePageTitle('Ingresar')

const authStore = useAuthStore()
const route = useRoute()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const sessionExpired = computed(() => route.query.expired === '1')

const login = async () => {
  if (!username.value.trim() || !password.value) {
    error.value = 'Completá usuario y contraseña.'
    return
  }

  loading.value = true
  error.value = null

  try {
    await authStore.login(username.value.trim(), password.value)
    await navigateTo('/')
  } catch {
    error.value = 'Usuario o contraseña incorrectos.'
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
        Bienvenido
      </h1>
      <p class="text-sm text-muted">
        Ingresá con tu cuenta para continuar.
      </p>
    </header>

    <div class="space-y-5">
      <UAlert
        v-if="sessionExpired"
        color="warning"
        variant="subtle"
        title="Su sesión ha expirado"
        description="Volvé a ingresar para continuar."
      />

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="error"
      />

      <form class="space-y-5" @submit.prevent="login">
        <UFormField label="Usuario" required>
          <UInput
            v-model="username"
            size="lg"
            placeholder="Tu usuario"
            autocomplete="username"
            :disabled="loading"
          />
        </UFormField>

        <UFormField label="Contraseña" required>
          <UInput
            v-model="password"
            type="password"
            size="lg"
            placeholder="••••••••"
            autocomplete="current-password"
            :disabled="loading"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="lg"
          label="Ingresar"
          :loading="loading"
        />
      </form>

      <p class="text-sm text-muted text-center">
        ¿No tenés cuenta?
        <NuxtLink to="/register" class="text-primary hover:underline">
          Registrarse
        </NuxtLink>
      </p>
    </div>

    <p class="text-xs text-muted">
      © {{ new Date().getFullYear() }} PSI Dashboard
    </p>
  </div>
</template>
