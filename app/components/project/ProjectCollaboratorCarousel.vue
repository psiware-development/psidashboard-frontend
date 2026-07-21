<script setup lang="ts">
import type { User } from '~/types/user'
import type { TaigaTeamMapPayload } from '~/types/project'

const props = defineProps<{
  users: (User)[]
  selectedUserIds: number[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:selectedUserIds': [value: number[]]
  'update:teamMap': [teamMap: TaigaTeamMapPayload]
}>()

const search = ref('')

const filteredUsers = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return props.users
  return props.users.filter(u =>
    u.fullname?.toLowerCase().includes(query)
    || u.username?.toLowerCase().includes(query)
  )
})

const isSelected = (idUser: number) => props.selectedUserIds.includes(idUser)

const getUserRole = (user: User): string => {
  return user.mainRole.description
}

const toggleUser = (user: User) => {
  const current = [...props.selectedUserIds]
  const index = current.indexOf(user.idUser)
  if (index >= 0) {
    current.splice(index, 1)
  } else {
    current.push(user.idUser)
  }
  emit('update:selectedUserIds', current)
  emit('update:teamMap', buildTeamMap(current))
}

const buildTeamMap = (selectedIds: number[]): TaigaTeamMapPayload => {
  const map: TaigaTeamMapPayload = {}
  selectedIds.forEach((id) => {
    const user = props.users.find(u => u.idUser === id)
    const roleKey = (user?.mainRole?.description || 'colaborador').toLowerCase().replace(/\s+/g, '-')
    if (!map[roleKey]) {
      map[roleKey] = []
    }
    map[roleKey].push(id)
  })
  return map
}

watch(() => props.selectedUserIds, (newIds) => {
  emit('update:teamMap', buildTeamMap(newIds))
}, { deep: true })
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <div>
        <label class="block text-sm font-semibold text-highlighted">
          Equipo de trabajo
        </label>
      </div>
      <UBadge
        v-if="selectedUserIds.length > 0"
        color="primary"
        variant="subtle"
        size="md"
      >
        {{ selectedUserIds.length }} {{ selectedUserIds.length === 1 ? 'seleccionado' : 'seleccionados' }}
      </UBadge>
    </div>

    <UInput
      v-model="search"
      placeholder="Buscar por nombre de usuario o nombre completo..."
      icon="i-lucide-search"
      class="w-full"
    />

    <div
      v-if="loading"
      class="flex gap-4 overflow-x-auto pb-4"
    >
      <USkeleton
        v-for="n in 4"
        :key="n"
        class="h-44 w-52 shrink-0 rounded-xl"
      />
    </div>

    <div
      v-else-if="filteredUsers.length === 0"
      class="rounded-xl border border-dashed border-default p-8 text-center"
    >
      <p class="text-sm text-muted">
        No se encontraron colaboradores activos.
      </p>
    </div>

    <div
      v-else
      class="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin"
    >
      <div
        v-for="user in filteredUsers"
        :key="user.idUser"
        class="min-w-[210px] max-w-[210px] shrink-0 snap-start rounded-xl border p-4 flex flex-col items-center justify-between gap-3 transition-all cursor-pointer bg-neutral-50/50 dark:bg-neutral-900/50 hover:shadow-sm"
        :class="isSelected(user.idUser)
          ? 'border-primary-500 ring-2 ring-primary-500/20 bg-primary-50/10 dark:bg-primary-950/20'
          : 'border-default hover:border-neutral-400 dark:hover:border-neutral-600'"
        @click="toggleUser(user)"
      >
        <UAvatar
          :src="user.image"
          :alt="user.fullname"
          size="xl"
        />

        <div class="text-center w-full min-w-0 space-y-1">
          <p class="font-semibold text-sm text-highlighted truncate w-full">
            {{ user.fullname }}
          </p>
          <p class="text-xs text-muted truncate w-full">
            {{ getUserRole(user) }}
          </p>
        </div>

        <div
          class="w-full pt-2 border-t border-default/50 flex items-center justify-center gap-2 text-xs font-medium"
          :class="isSelected(user.idUser) ? 'text-primary-600 dark:text-primary-400' : 'text-muted'"
        >
          <UIcon
            :name="isSelected(user.idUser) ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
            class="h-4 w-4"
          />
          <span>{{ isSelected(user.idUser) ? 'Asignado' : 'Asignar' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
