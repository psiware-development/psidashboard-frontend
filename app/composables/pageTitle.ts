export function usePageTitle(title?: MaybeRef<string>) {
  const config = useRuntimeConfig()

  const prefix = config.public.appTitlePrefix ? `${config.public.appTitlePrefix} | ` : ''

  const pageTitle = useState<string>('page-title', () => 'Dashboard')

  if (title !== undefined) {
    // Si se pasa un título, lo seteamos
    const titleValue = computed(() => toValue(title))

    // Actualizar el state reactivamente
    watch(titleValue, (newTitle) => {
      pageTitle.value = newTitle
    }, { immediate: true })

    // También setear el head del documento
    useHead({
      title: prefix + titleValue.value
    })
  }

  return pageTitle
}
