<script setup lang="ts">
const isExpanded = defineModel<boolean>('isExpanded', { default: true })
defineProps<{
  isMobile: boolean
}>()

const authStore = useAuthStore()

const closeSidebar = () => {
  isExpanded.value = false
}

const logout = async () => {
  authStore.logout()
  await navigateTo('/login')
}
</script>

<template>
  <div>
    <div
      v-if="isExpanded && isMobile"
      class="fixed inset-0 bg-neutral-950/20 backdrop-blur-xs z-40 transition-opacity duration-300"
      @click="closeSidebar"
    />

    <aside
      class="fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 z-40 flex flex-col justify-between"
      :class="[
        isExpanded ? 'w-64' : 'w-16',
        isMobile && !isExpanded ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <div class="flex-1 py-4 px-3 space-y-1">
        <NuxtLink
          to="/"
          class="flex items-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all duration-200 group py-2.5"
          :class="isExpanded ? 'px-3 gap-3 w-full' : 'justify-center px-0 w-10 mx-auto'"
          active-class="bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/15"
        >
          <UIcon
            name="i-lucide-home"
            class="w-5 h-5 flex-shrink-0 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors"
          />
          <span
            v-if="isExpanded"
            class="text-sm font-medium transition-opacity duration-200"
          >
            Inicio
          </span>
        </NuxtLink>

        <NuxtLink
          v-if="authStore.currentUser?.idUser"
          v-slot="{ isActive }"
          :to="`/user/${authStore.currentUser.idUser}/tasks`"
          class="flex items-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all duration-200 group py-2.5"
          :class="isExpanded ? 'px-3 gap-3 w-full' : 'justify-center px-0 w-10 mx-auto'"
          active-class="bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/15"
        >
          <UIcon
            name="i-lucide-check-square"
            class="w-5 h-5 flex-shrink-0 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors"
          />
          <span
            v-if="isExpanded"
            class="text-sm font-medium transition-opacity duration-200"
          >
            Tareas
          </span>
        </NuxtLink>
      </div>

      <div class="p-3 border-t border-neutral-200 dark:border-neutral-800">
        <button
          class="flex items-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all duration-200 group py-2.5 w-full"
          :class="isExpanded ? 'px-3 gap-3' : 'justify-center px-0 w-10 mx-auto'"
          @click="logout"
        >
          <UIcon
            name="i-lucide-log-out"
            class="w-5 h-5 flex-shrink-0 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors"
          />
          <span
            v-if="isExpanded"
            class="text-sm font-medium transition-opacity duration-200"
          >
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  </div>
</template>
