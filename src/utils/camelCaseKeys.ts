export function camelCaseKeys(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(camelCaseKeys)
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      let camelCaseKey = key.replace(/ID/g, 'Id') // Replace "ID" with "Id"
      camelCaseKey =
        camelCaseKey.charAt(0).toLowerCase() + camelCaseKey.slice(1) // Convert first character to lowercase
      return [camelCaseKey, camelCaseKeys(value)]
    }),
  )
}
