<script setup lang="ts" generic="T extends Record<string, any>">
export interface AppTableColumn<TRow = unknown> {
  accessorKey: string
  header: string
  sortable?: boolean
  sortFn?: (a: TRow, b: TRow) => number
  align?: 'left' | 'center' | 'right'
  headerClass?: string
}

const props = withDefaults(
  defineProps<{
    data: T[]
    columns: AppTableColumn<T>[]
    defaultSortKey?: string
    defaultSortDir?: 'asc' | 'desc'
    loading?: boolean
    isEmpty?: boolean
    emptyIcon?: string
    emptyText?: string
  }>(),
  {
    defaultSortKey: undefined,
    defaultSortDir: 'asc',
    loading: false,
    isEmpty: false,
    emptyIcon: 'i-lucide-inbox',
    emptyText: 'No hay registros para mostrar.'
  }
)

const emit = defineEmits<{
  'update:sortKey': [value: string | undefined]
  'update:sortDir': [value: 'asc' | 'desc']
}>()

const sortKey = ref<string | undefined>(props.defaultSortKey)
const sortDir = ref<'asc' | 'desc'>(props.defaultSortDir)

watch(() => props.defaultSortKey, (val) => {
  if (val !== undefined) {
    sortKey.value = val
  }
})

watch(() => props.defaultSortDir, (val) => {
  if (val) {
    sortDir.value = val
  }
})

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
  emit('update:sortKey', sortKey.value)
  emit('update:sortDir', sortDir.value)
}

function getNestedValue(obj: Record<string, unknown> | null | undefined, path: string): unknown {
  if (!obj || !path) return undefined
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

const sortedData = computed(() => {
  if (!props.data || props.data.length === 0) return []
  if (!sortKey.value) return props.data

  const currentCol = props.columns.find(c => c.accessorKey === sortKey.value)
  const list = [...props.data]

  list.sort((a, b) => {
    if (currentCol?.sortFn) {
      const res = currentCol.sortFn(a, b)
      return sortDir.value === 'asc' ? res : -res
    }

    const valA = getNestedValue(a, sortKey.value!)
    const valB = getNestedValue(b, sortKey.value!)

    if (valA === valB) return 0
    if (valA == null || valA === '') return 1
    if (valB == null || valB === '') return -1

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDir.value === 'asc' ? valA - valB : valB - valA
    }

    if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      const numA = valA ? 1 : 0
      const numB = valB ? 1 : 0
      return sortDir.value === 'asc' ? numA - numB : numB - numA
    }

    const isDateParamA = typeof valA === 'string' || typeof valA === 'number' || valA instanceof Date
    const isDateParamB = typeof valB === 'string' || typeof valB === 'number' || valB instanceof Date
    const dateA = isDateParamA ? new Date(valA as string | number | Date).getTime() : NaN
    const dateB = isDateParamB ? new Date(valB as string | number | Date).getTime() : NaN
    const isValANumberStr = typeof valA === 'string' && !Number.isNaN(Number(valA)) && valA.trim() !== ''
    const isValBNumberStr = typeof valB === 'string' && !Number.isNaN(Number(valB)) && valB.trim() !== ''

    if (!isValANumberStr && !isValBNumberStr && !Number.isNaN(dateA) && !Number.isNaN(dateB) && typeof valA !== 'number' && typeof valB !== 'number') {
      return sortDir.value === 'asc' ? dateA - dateB : dateB - dateA
    }

    const strA = String(valA).toLowerCase()
    const strB = String(valB).toLowerCase()
    return sortDir.value === 'asc'
      ? strA.localeCompare(strB, 'es')
      : strB.localeCompare(strA, 'es')
  })

  return list
})

const computedIsEmpty = computed(() => {
  return props.isEmpty || sortedData.value.length === 0
})
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0 overflow-x-auto' }">
    <!-- Skeleton Loading -->
    <div
      v-if="loading"
      class="p-4 space-y-3"
    >
      <USkeleton
        v-for="index in 5"
        :key="index"
        class="h-10 w-full rounded-md"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="computedIsEmpty"
      class="flex flex-col items-center justify-center py-12 px-4 gap-2 text-center"
    >
      <UIcon
        v-if="emptyIcon"
        :name="emptyIcon"
        class="size-10 text-muted/60"
      />
      <p class="text-sm font-medium text-muted">
        {{ emptyText }}
      </p>
    </div>

    <!-- Table -->
    <UTable
      v-else
      :data="sortedData"
      :columns="columns"
      v-bind="$attrs"
    >
      <!-- Header slot override for sortable columns -->
      <template
        v-for="col in columns"
        :key="`header-${col.accessorKey}`"
        #[`${col.accessorKey}-header`]="headerProps"
      >
        <slot
          :name="`${col.accessorKey}-header`"
          v-bind="headerProps"
        >
          <button
            v-if="col.sortable !== false"
            type="button"
            class="inline-flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wide text-highlighted cursor-pointer hover:text-primary transition-colors focus:outline-hidden w-full"
            :class="[
              col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start',
              col.headerClass
            ]"
            @click="handleSort(col.accessorKey)"
          >
            <span>{{ col.header }}</span>
            <UIcon
              v-if="sortKey === col.accessorKey"
              :name="sortDir === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'"
              class="size-3.5 text-primary flex-shrink-0"
            />
            <UIcon
              v-else
              name="i-lucide-arrow-up-down"
              class="size-3.5 text-muted/40 hover:text-muted flex-shrink-0"
            />
          </button>
          <span
            v-else
            class="block font-semibold text-xs uppercase tracking-wide text-highlighted w-full"
            :class="[
              col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
              col.headerClass
            ]"
          >
            {{ col.header }}
          </span>
        </slot>
      </template>

      <!-- Forward all cell slots transparently to consuming component -->
      <template
        v-for="(_, name) in $slots"
        :key="`slot-${String(name)}`"
        #[name]="slotData"
      >
        <slot
          :name="name"
          v-bind="slotData"
        />
      </template>
    </UTable>
  </UCard>
</template>
