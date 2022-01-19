/**
 * @param {number} number
 * @param {number} min
 * @param {number} max
 * @returns {Number}
 */
function clamp (number, min, max) {
  return Math.max(min, Math.min(number, max))
}

export default clamp
