<script setup lang="ts">
const authStore = useAuthStore()

const {
  loading,
  error,
  profileEntries,
  fetchMe
} = useMeData()

usePageTitle('Mis datos')

onMounted(() => {
  fetchMe()
})
</script>

<template>
  <div class="mx-auto w-full max-w-[900px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <SectionTitle title="Mis datos" />

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <UCard>
      <div class="flex flex-col sm:flex-row sm:items-center gap-6">
        <UAvatar
          :src="authStore.currentUser?.image"
          :alt="authStore.displayName"
          size="3xl"
        />

        <div class="flex-1 space-y-4">
          <div
            v-if="loading"
            class="space-y-3"
          >
            <USkeleton
              v-for="index in 5"
              :key="index"
              class="h-8"
            />
          </div>

          <dl
            v-else
            class="grid gap-3 sm:grid-cols-2"
          >
            <div
              v-for="entry in profileEntries"
              :key="entry.label"
              class="rounded-lg border border-default px-4 py-3"
            >
              <dt class="text-xs uppercase tracking-wide text-muted">
                {{ entry.label }}
              </dt>
              <dd class="mt-1 text-sm font-medium text-highlighted">
                {{ entry.value }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </UCard>
  </div>
</template>
