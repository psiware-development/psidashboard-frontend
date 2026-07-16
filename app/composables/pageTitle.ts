export function usePageTitle(title?: MaybeRef<string>, breadcrumbLabel?: MaybeRef<string>) {
  const config = useRuntimeConfig()

  const prefix = config.public.appTitlePrefix ? `${config.public.appTitlePrefix} | ` : ''

  const pageTitle = useState<string>('page-title', () => 'Dashboard')
  const breadcrumbTitle = useState<string | undefined>('breadcrumb-label', () => undefined)

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

  if (breadcrumbLabel !== undefined) {
    const crumbValue = computed(() => toValue(breadcrumbLabel))
    watch(crumbValue, (newLabel) => {
      breadcrumbTitle.value = newLabel
    }, { immediate: true })
  } else {
    // Limpiar el override al montar páginas que no lo necesitan
    breadcrumbTitle.value = undefined
  }

  return pageTitle
}
