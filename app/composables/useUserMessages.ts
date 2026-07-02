import type { ActiveUser, UserMessage } from '~/types/user'
import { canAccessUserResource } from '~/utils/userAccess'

export const useUserMessages = (userId: MaybeRef<string | number>) => {
  const authStore = useAuthStore()
  const toast = useToast()
  const { $api } = useNuxtApp()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const forbidden = ref(false)
  const user = ref<ActiveUser | null>(null)
  const receivedMessages = ref<UserMessage[]>([])
  const sentMessages = ref<UserMessage[]>([])
  const updatingMessageId = ref<number | null>(null)

  const fetchMessages = async () => {
    const id = toValue(userId)
    loading.value = true
    error.value = null
    forbidden.value = false

    if (!canAccessUserResource(authStore.currentUser, id)) {
      forbidden.value = true
      error.value = 'No tenés permisos para ver los mensajes de este usuario.'
      loading.value = false
      return
    }

    try {
      const users = await $api<ActiveUser[]>('/users/active')
      user.value = users.find(item => item.idUser === Number(id)) ?? null

      if (!user.value) {
        error.value = `No existe un usuario con id: ${id}`
        return
      }

      const [pending, sent] = await Promise.all([
        $api<UserMessage[]>(`/cases/messages/${id}/pending`),
        $api<UserMessage[]>(`/cases/messages/${id}/sent`)
      ])

      receivedMessages.value = pending ?? []
      sentMessages.value = sent ?? []
    } catch {
      error.value = 'No se pudieron cargar los mensajes.'
    } finally {
      loading.value = false
    }
  }

  const updateMessage = async (
    messageId: number,
    status: number,
    type: 'received' | 'sent' = 'received'
  ) => {
    updatingMessageId.value = messageId

    try {
      await $api(`/cases/${messageId}`, {
        method: 'PATCH',
        body: { status }
      })

      toast.add({
        title: 'Mensaje actualizado',
        color: 'success'
      })

      const id = toValue(userId)

      if (type === 'sent') {
        sentMessages.value = await $api<UserMessage[]>(`/cases/messages/${id}/sent`)
      } else {
        receivedMessages.value = await $api<UserMessage[]>(`/cases/messages/${id}/pending`)
      }
    } catch {
      toast.add({
        title: 'Error al actualizar el mensaje',
        color: 'error'
      })
    } finally {
      updatingMessageId.value = null
    }
  }

  return {
    loading,
    error,
    forbidden,
    user,
    receivedMessages,
    sentMessages,
    updatingMessageId,
    fetchMessages,
    updateMessage
  }
}
