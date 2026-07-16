export interface BreadcrumbItem {
  label: string
  to?: string
}

const SEGMENT_LABELS: Record<string, string> = {
  '': 'Inicio',
  'admin': 'Administración',
  'users': 'Usuarios',
  'projects': 'Proyectos',
  'clients': 'Clientes',
  'project': 'Proyectos',
  'user': 'Usuarios',
  'collaborators': 'Colaboradores',
  'monitor': 'Reporte de horas',
  'new': 'Nuevo',
  'edit': 'Editar',
  'tracking': 'Tracking',
  'working-on': 'Working on',
  'monthly-stats': 'Estadísticas mensuales',
  'resume': 'Resume',
  'tasks': 'Tareas',
  'messages': 'Mensajes'
}

const isDynamicId = (segment: string) => /^\d+$/.test(segment)

export const useBreadcrumb = () => {
  const route = useRoute()
  const pageTitle = useState<string>('page-title')
  const breadcrumbLabel = useState<string | undefined>('breadcrumb-label')

  const crumbs = computed((): BreadcrumbItem[] => {
    const segments = route.path.split('/').filter(Boolean)

    if (segments.length === 0) {
      return [{ label: 'Inicio' }]
    }

    const result: BreadcrumbItem[] = [{ label: 'Inicio', to: '/' }]

    let accumulatedPath = ''

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      accumulatedPath += `/${segment}`

      // Los IDs dinámicos no se renderizan como crumb individual,
      if (isDynamicId(segment)) {
        continue
      }

      // Un segmento es el último crumb visible si:
      // - es el último segmento, O
      // - el único segmento restante tras él es un ID dinámico
      const remainingSegments = segments.slice(i + 1)
      const isLast = remainingSegments.length === 0
        || remainingSegments.every(s => isDynamicId(s))

      if (isLast) {
        // El último crumb usa breadcrumbLabel si está definido, sino el pageTitle reactivo
        const label = breadcrumbLabel.value || pageTitle.value || SEGMENT_LABELS[segment] || segment
        result.push({ label })
      } else {
        result.push({
          label: SEGMENT_LABELS[segment] || segment,
          to: accumulatedPath
        })
      }
    }

    return result
  })

  return { crumbs }
}
