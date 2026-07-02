export function formatHoursGreen(declared?: number | null, planned?: number | null): number {
  if (!declared || declared === 0) {
    return 0
  }

  if (!planned || planned === 0) {
    return 0
  }

  return declared
}

export function formatHoursYellow(declared?: number | null, planned?: number | null): number {
  if (!planned || planned === 0) {
    return 0
  }

  if (!declared || declared <= planned) {
    return planned - (declared ?? 0)
  }

  return 0
}

export function formatHoursRed(declared?: number | null, planned?: number | null): number {
  if (!planned || planned === 0) {
    return declared ?? 0
  }

  if (!declared || declared === 0) {
    return 0
  }

  if (declared >= planned) {
    return declared - planned
  }

  return 0
}

export function getCurrentMonthName(): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  return months[new Date().getMonth()] ?? ''
}

export function getProjectProgress(declared?: number | null, planned?: number | null): number {
  if (!planned || planned <= 0) {
    return declared && declared > 0 ? 100 : 0
  }

  if (!declared) {
    return 0
  }

  return Math.min(Math.round((declared / planned) * 100), 100)
}

export function getUsRatio(realHours?: number, points?: number) {
  if (!points || !realHours) {
    return { value: '-', tone: 'neutral' as const }
  }

  const ratio = realHours / points
  const value = ratio.toFixed(2)

  if (ratio === 0 || (ratio >= 0.25 && ratio <= 2.24)) {
    return { value, tone: 'success' as const }
  }

  if (ratio <= 0.24 && ratio > 0) {
    return { value, tone: 'warning' as const }
  }

  return { value, tone: 'error' as const }
}
