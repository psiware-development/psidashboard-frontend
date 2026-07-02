export function formatDate(date?: string | Date): string {
  if (!date) {
    return '-'
  }

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) {
    return '-'
  }

  const day = String(value.getDate()).padStart(2, '0')
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const year = value.getFullYear()

  return `${day}-${month}-${year}`
}

export function formatRelativeDate(date?: string | Date): string {
  if (!date) {
    return ''
  }

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) {
    return ''
  }

  const diffMs = Date.now() - value.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 24) {
    const rtf = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' })
    const diffMinutes = Math.round(diffMs / (1000 * 60))

    if (diffMinutes < 60) {
      return rtf.format(-diffMinutes, 'minute')
    }

    return rtf.format(-Math.round(diffHours), 'hour')
  }

  const formatted = value.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
