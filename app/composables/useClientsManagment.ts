import type { Customer } from '~/types/customer'

export const useClientsManagment = () => {
  const { $api } = useNuxtApp()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const clients = ref<Customer[]>([])

  const search = ref('')
  const filterActive = ref<boolean | undefined>(undefined)

  const filteredClients = computed(() => {
    let result = clients.value

    if (search.value) {
      const q = search.value.toLowerCase()
      result = result.filter(c => c.corporateName.toLowerCase().includes(q))
    }

    if (filterActive.value !== undefined) {
      result = result.filter(c => c.active === filterActive.value)
    }

    return result
  })

  const fetchClients = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $api<Customer[]>('/customers')
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
    search,
    filterActive,
    filteredClients,
    clientOptions,
    fetchClients
  }
}
