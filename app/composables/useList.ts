import type { Ref } from 'vue'
import { type ListEndpoints, type ListMessages, DEFAULT_MESSAGES } from '~/types/listing'

export interface ListOptions<T extends object> {
  endpoints: ListEndpoints
  idField: keyof T
  filterFn?: (item: T, search: string) => boolean
  messages?: Partial<ListMessages>
}

export function useList<T extends object>(opts: ListOptions<T>) {
  const { $api } = useNuxtApp()
  const toast = useToast()
  const msg: ListMessages = { ...DEFAULT_MESSAGES, ...opts.messages }

  const loading = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const error = ref<string | null>(null)
  const items = ref<T[]>([]) as Ref<T[]>
  const search = ref('')

  const filteredItems = computed<T[]>(() => {
    if (!opts.filterFn) return items.value
    return items.value.filter(item => opts.filterFn!(item, search.value))
  })

  const fetch = async (): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<T[]>(opts.endpoints.list)
      items.value = response ?? []
    } catch {
      error.value = msg.fetchError
    } finally {
      loading.value = false
    }
  }

  const fetchOne = async (id: number): Promise<T | null> => {
    try {
      return await $api<T>(`${opts.endpoints.item}/${id}`)
    } catch {
      return null
    }
  }

  const create = async (payload: unknown): Promise<T | null> => {
    saving.value = true
    try {
      const response = await $api<T>(opts.endpoints.create ?? opts.endpoints.item, {
        method: 'POST',
        body: payload as Record<string, unknown>
      })
      toast.add({ title: msg.createSuccess, color: 'success' })
      return response
    } catch {
      toast.add({ title: msg.createError, color: 'error' })
      return null
    } finally {
      saving.value = false
    }
  }

  const update = async (id: number, payload: unknown): Promise<boolean> => {
    saving.value = true
    try {
      await $api(`${opts.endpoints.item}/${id}`, {
        method: 'PATCH',
        body: payload as Record<string, unknown>
      })
      toast.add({ title: msg.updateSuccess, color: 'success' })
      return true
    } catch {
      toast.add({ title: msg.updateError, color: 'error' })
      return false
    } finally {
      saving.value = false
    }
  }

  const remove = async (id: number): Promise<boolean> => {
    deleting.value = true
    try {
      await $api(`${opts.endpoints.item}/${id}`, { method: 'DELETE' })
      items.value = items.value.filter(
        item => (item[opts.idField] as unknown as number) !== id
      )
      toast.add({ title: msg.deleteSuccess, color: 'success' })
      return true
    } catch {
      toast.add({ title: msg.deleteError, color: 'error' })
      return false
    } finally {
      deleting.value = false
    }
  }

  return {
    loading,
    saving,
    deleting,
    error,
    items,
    search,
    filteredItems,
    fetch,
    fetchOne,
    create,
    update,
    remove
  }
}
