import type { CollaboratorsStatusResponse } from '~/types/collaborator'

export const useCollaboratorsStatus = () => {
  const { $api } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const collaborators = ref<CollaboratorsStatusResponse>({})

  const fetchCollaboratorsStatus = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<CollaboratorsStatusResponse>('/users/status')
      collaborators.value = response || {}
    } catch (err) {
      console.error('Error fetching collaborators status:', err)
      error.value = 'No se pudieron cargar los datos de los colaboradores.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    collaborators,
    fetchCollaboratorsStatus
  }
}
