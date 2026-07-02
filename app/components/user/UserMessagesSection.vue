<script setup lang="ts">
import type { UserMessage } from '~/types/user'
import { getMessageProgressColor, getMessageProgressValue } from '~/utils/userCases'

defineProps<{
  title: string
  messages: UserMessage[]
  loading?: boolean
  mode: 'received' | 'sent'
  updatingMessageId?: number | null
}>()

const emit = defineEmits<{
  update: [messageId: number, status: number, type: 'received' | 'sent']
}>()
</script>

<template>
  <section class="space-y-4">
    <HomeSectionTitle :title="title" />

    <UCard :ui="{ body: 'p-0 sm:p-0 overflow-x-auto' }">
      <div v-if="loading" class="p-4 space-y-2">
        <USkeleton v-for="index in 3" :key="index" class="h-12" />
      </div>

      <div v-else-if="messages.length > 0" class="divide-y divide-default min-w-[720px]">
        <div
          v-for="message in messages"
          :key="message.id"
          class="grid gap-4 p-4 lg:grid-cols-12 lg:items-center"
        >
          <div class="lg:col-span-2 text-sm font-medium">
            {{ mode === 'received' ? message.userSender?.fullname : message.userReceiver?.fullname }}
          </div>

          <div class="lg:col-span-4 text-sm">
            {{ message.message }}
          </div>

          <div class="lg:col-span-3 space-y-2">
            <div class="flex items-center justify-between text-xs text-muted">
              <span>{{ message.status }}</span>
              <span>{{ getMessageProgressValue(message.status) }}%</span>
            </div>
            <UProgress
              :model-value="getMessageProgressValue(message.status)"
              :color="getMessageProgressColor(message.status)"
              size="sm"
            />
          </div>

          <div class="lg:col-span-3 flex flex-wrap gap-2">
            <template v-if="mode === 'received'">
              <UButton
                v-if="message.status === 'Iniciado'"
                size="xs"
                label="Leído"
                :loading="updatingMessageId === message.id"
                @click="emit('update', message.id, 2, 'received')"
              />
              <UButton
                v-if="message.status === 'Iniciado' || message.status === 'Leido'"
                size="xs"
                color="primary"
                label="Iniciar"
                :loading="updatingMessageId === message.id"
                @click="emit('update', message.id, 3, 'received')"
              />
              <UButton
                v-if="message.status === 'En progreso'"
                size="xs"
                color="success"
                label="Cerrar"
                :loading="updatingMessageId === message.id"
                @click="emit('update', message.id, 4, 'received')"
              />
            </template>

            <UButton
              v-else
              size="xs"
              color="success"
              label="Cerrar"
              :loading="updatingMessageId === message.id"
              @click="emit('update', message.id, 4, 'sent')"
            />
          </div>
        </div>
      </div>

      <p v-else class="p-4 text-sm text-muted text-center">
        {{ mode === 'received' ? 'El usuario no tiene mensajes recibidos.' : 'El usuario no tiene mensajes enviados.' }}
      </p>
    </UCard>
  </section>
</template>
