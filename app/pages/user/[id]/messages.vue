<script setup lang="ts">
const route = useRoute()
const userId = computed(() => route.params.id as string)

const {
  loading,
  error,
  forbidden,
  receivedMessages,
  sentMessages,
  updatingMessageId,
  fetchMessages,
  updateMessage
} = useUserMessages(userId)

usePageTitle('Mensajes')

onMounted(() => {
  fetchMessages()
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <SectionTitle title="Mensajes" />

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <UAlert
      v-if="forbidden"
      color="warning"
      variant="subtle"
      title="Acceso restringido"
      :description="`No tenés permisos para ver los mensajes del usuario ${userId}.`"
    />

    <template v-else>
      <UserMessagesSection
        title="Recibidos"
        mode="received"
        :messages="receivedMessages"
        :loading="loading"
        :updating-message-id="updatingMessageId"
        @update="updateMessage"
      />

      <UserMessagesSection
        title="Enviados"
        mode="sent"
        :messages="sentMessages"
        :loading="loading"
        :updating-message-id="updatingMessageId"
        @update="updateMessage"
      />
    </template>
  </div>
</template>
