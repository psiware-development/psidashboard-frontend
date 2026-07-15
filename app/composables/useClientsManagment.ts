import type { Customer } from '~/types/customer'

export const useClientsManagment = () => {
  const { $api } = useNuxtApp()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const clients = ref<Customer[]>([])

  const fetchClients = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $api<Customer[]>('/clients/active')
      clients.value = response ?? []
    } catch {
      error.value = 'No se pudo cargar el listado de clientes.'
    } finally {
      loading.value = false
    }
  }

  const clientOptions = computed(() =>
    clients.value.map(c => ({
      label: c.corporateName,
      value: c.idCustomer
    }))
  )

  return {
    loading,
    error,
    clients,
    clientOptions,
    fetchClients
  }
}
