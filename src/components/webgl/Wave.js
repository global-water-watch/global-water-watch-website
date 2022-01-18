import Mesh from './Mesh'
import clamp from './clamp.js'
import hex2rgba from './hex2rgba.js'

/**
 * @param {object} container - dom node
 * @param {number} speed - decimal float
 * @param {string} color - hex string with 6 characters
 * @param {number} opacity - decimal float 0-1
 */
function Wave ({
  container,
  speed = 0.0005,
  color = '#0AB6FF',
  opacity = 1,
} = {}) {
  if (!container) {
    throw new Error('No container specified')
  }

  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl', {
    alpha: true,
  })
  const extension = gl.getExtension('ANGLE_instanced_arrays')

  if (gl === null) {
    throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.')
  }

  if (!extension) {
    throw new Error('No support for ANGLE_instanced_arrays')
  }

  let width = 30
  let height = 30
  let spread = 1
  let isPlaying = true
  let resizeTimeout
  let frame
  const mesh = new Mesh({
    gl,
    extension,
    size: 1,
    gap: 10,
    color: hex2rgba(color, opacity),
   })

  container.appendChild(canvas)

  setSize(0)
  setViewport()
  frame = requestAnimationFrame(loop)

  function loop (timeStamp) {
    if (!isPlaying) {
      return
    }

    if (width !== container.clientWidth || height !== container.clientHeight) {
      setSize()
    }
    setViewport()

    gl.clearColor(0, 0, 0, 0)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    gl.enable(gl.BLEND)
    gl.disable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT)

    if (mesh) {
      mesh.draw({ delta: timeStamp * speed, spread })
    }

    frame = requestAnimationFrame(loop)
  }

  function setSize (delay = 500) {
    if (resizeTimeout === undefined) {
      resizeTimeout = setTimeout(() => {
        width = container.clientWidth
        height = container.clientHeight
        canvas.width = width
        canvas.height = height

        if (mesh) {
          mesh.update({ width })
        }

        resizeTimeout = undefined
      }, delay)
    }
  }

  function setViewport () {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  }

  this.play = () => {
    isPlaying = true
    frame = requestAnimationFrame(loop)
  }

  this.pause = () => {
    isPlaying = false
  }

  this.destroy = () => {
    isPlaying = false
    if (frame) {
      cancelAnimationFrame(frame)
      frame = null
    }
  }

  this.setSpread = (value) => {
    spread = clamp(value, 0, 1)
  }
}

export default Wave
