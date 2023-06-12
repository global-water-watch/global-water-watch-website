export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

export const formatDate = (date) => {
  if (!date) { return null }

  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

export const isoFormatDate = (date) => {
  return date.toISOString().substring(0, 10)
}
