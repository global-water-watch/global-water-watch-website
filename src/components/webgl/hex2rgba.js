/**
 * @param {string} hex - 6 character hex value (optional #)
 * @param {number} alpha - decimal float 0-1
 * @returns {Array}
 */
function hex2rgba (hex, alpha = 1) {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255)
  return [r, g, b, alpha]
}

export default hex2rgba
