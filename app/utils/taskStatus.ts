export interface TaskStatusStyle {
  label: string
  background: string
  color: string
}

const statusMaps: Record<string, TaskStatusStyle> = {
  'en-progreso': { label: 'En Progreso', background: '#ff9900', color: '#ffffff' },
  'nuevo': { label: 'Nuevo', background: '#cbcbcb', color: '#000000' },
  'publicado-en-qa': { label: 'Publicado en QA', background: '#fcc000', color: '#ffffff' },
  'in-progress': { label: 'En progreso', background: '#ff9900', color: '#ffffff' },
  'new': { label: 'Nuevo', background: '#cbcbcb', color: '#000000' },
  'ready-for-validation': { label: 'Ready For Validation', background: '#fcc000', color: '#ffffff' },
  'ready-for-test': { label: 'Ready For Test', background: '#fcc000', color: '#ffffff' },
  'done': { label: 'Listo', background: '#669900', color: '#ffffff' },
  'listo': { label: 'Listo', background: '#669900', color: '#ffffff' },
  'archivado': { label: 'Archivado', background: '#666666', color: '#ffffff' },
  'qa-ok': { label: 'QA OK', background: '#3465a4', color: '#ffffff' },
  'mas-informacion': { label: 'Mas información', background: '#89BAB4', color: '#ffffff' },
  'undefined': { label: 'Estado no declarado', background: '#89bab4b3', color: '#000000' }
}

export function getTaskStatus(status?: string): TaskStatusStyle {
  if (!status) {
    return { label: 'Sin estado', background: '#89bab4b3', color: '#000000' }
  }

  const normalized = status.trim()

  if (Object.hasOwn(statusMaps, normalized)) {
    return statusMaps[normalized]!
  }

  return {
    label: normalized.split('-').join(' '),
    background: '#00C9B2',
    color: '#ffffff'
  }
}

export function getSeverityColor(severity?: string): string {
  switch (severity) {
    case 'Wishlist': return '#666666'
    case 'Minor': return '#669933'
    case 'Normal': return '#0000ff'
    case 'Important': return '#ffa500'
    case 'Critical': return '#cc0000'
    default: return '#94a3b8'
  }
}
