import type { Customer } from '~/types/customer'

export const useClientsManagment = () => {
  const filterActive = ref<boolean | undefined>(undefined)

  const list = useList<Customer>({
    endpoints: {
      list: '/customers',
      item: '/customers'
    },
    idField: 'idCustomer',
    filterFn: (c, search) => {
      const matchesSearch = !search
        || c.corporateName.toLowerCase().includes(search.toLowerCase())

      const matchesActive = filterActive.value === undefined
        || c.active === filterActive.value

      return matchesSearch && matchesActive
    },
    messages: {
      fetchError: 'No se pudo cargar el listado de clientes.'
    }
  })

  const clientOptions = computed(() =>
    list.items.value.map(c => ({
      label: c.corporateName,
      value: c.idCustomer
    }))
  )

  return {
    loading: list.loading,
    error: list.error,
    clients: list.items,
    search: list.search,
    filterActive,
    filteredClients: list.filteredItems,
    clientOptions,
    fetchClients: list.fetch
  }
}
