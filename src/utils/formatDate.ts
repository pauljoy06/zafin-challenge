const DATE_OPTIONS: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }

export function formatDate(value: string | number | Date, locale?: string) {
  try {
    const formatter = new Intl.DateTimeFormat(locale, DATE_OPTIONS)
    return formatter.format(typeof value === 'string' ? new Date(value) : value)
  } catch {
    return typeof value === 'string' ? value : String(value)
  }
}
