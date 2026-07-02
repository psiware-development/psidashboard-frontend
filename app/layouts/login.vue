<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-12">
    <aside
      class="relative lg:col-span-8 min-h-[220px] lg:min-h-screen overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-900"
      aria-hidden="true"
    >
      <img
        v-show="!imageMissing"
        src="/images/login-hero.webp"
        alt=""
        class="absolute inset-0 size-full object-cover"
        @error="imageMissing = true"
      >

      <div
        v-if="imageMissing"
        class="absolute inset-0 flex items-end p-8 lg:p-12"
      >
        <div class="max-w-xl text-white">
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            PSI Dashboard
          </p>
          <p class="mt-3 text-2xl font-semibold leading-tight lg:text-3xl">
            Gestión de proyectos y equipos
          </p>
        </div>
      </div>

      <div
        v-else
        class="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent"
      />
    </aside>

    <main class="lg:col-span-4 flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 bg-default">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const imageMissing = ref(false)
</script>
