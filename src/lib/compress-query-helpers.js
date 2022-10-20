import LZString from 'lz-string'

/**
 * Compresses a query string using LZString
 * @param query
 * @returns {string|string|string}
 */
export const compressQuery = (query) => {
  return LZString.compressToEncodedURIComponent(query)
}

/**
 * Decompresses a query string using LZString
 * @param query
 * @returns {string|string|string}
 */
export const decompressQuery = (query) => {
  console.log('--------- decompressQuery --------')
  console.log(query)
  console.log(LZString.decompressFromEncodedURIComponent(query))
  console.log('--------- end - decompressQuery --------')
  return LZString.decompressFromEncodedURIComponent(query)
}
