export function getMessageProgressValue(status: string): number {
  const statusMap: Record<string, number> = {
    'Iniciado': 0,
    'Leido': 25,
    'En progreso': 75,
    'Cerrado': 100
  }

  return statusMap[status] ?? 0
}

export function getMessageProgressColor(status: string): 'warning' | 'success' | 'primary' | 'neutral' {
  const colorMap: Record<string, 'warning' | 'success' | 'primary' | 'neutral'> = {
    'Iniciado': 'warning',
    'Leido': 'warning',
    'En progreso': 'success',
    'Cerrado': 'primary'
  }

  return colorMap[status] ?? 'neutral'
}
