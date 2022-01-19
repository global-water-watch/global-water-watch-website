import Program from './Program'
import WebglBuffer from './WebglBuffer'
import vertexShader from './vertexShader'
import fragmentShader from './fragmentShader'

const clipSpaceRange = 2 // https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html

export default function Mesh ({
  gl,
  extension,
  size = 3,
  gap = 40,
  color,
} = {}) {
  const { program } = new Program(gl, vertexShader, fragmentShader)

  let vertexCount
  let instanceCount
  let buffers = []

  const deltaLocation = gl.getUniformLocation(program, 'u_delta')
  const colorLocation = gl.getUniformLocation(program, 'u_color')
  const spreadLocation = gl.getUniformLocation(program, 'u_spread')

  bindBuffers()

  function bindBuffers () {
    if (buffers.length) {
      buffers = []
    }

    const { width } = gl.canvas

    instanceCount = 1 + Math.floor((width - size) / gap)

    const instanceOffsets = getInstanceOffsets({
      rectangleWidth: size,
      canvasWidth: width,
      count: instanceCount,
    })
    const vertices = getVertices({ rectangleWidth: size, canvasWidth: width })

    vertexCount = vertices.length / 2

    buffers.push(
      new WebglBuffer({
        gl,
        extension,
        program,
        data: instanceOffsets,
        name: 'a_offset',
        size: 1,
        instancedAttribute: true,
      }),
      new WebglBuffer({
        gl,
        program,
        data: vertices,
        name: 'a_vertex',
        size: 2,
      }),
    )
  }

  this.draw = ({ delta, spread = 1 } = {}) => {
    gl.useProgram(program)

    gl.uniform1f(deltaLocation, delta)
    gl.uniform4fv(colorLocation, color)
    gl.uniform1f(spreadLocation, spread)

    buffers.forEach(buffer => buffer.draw())
    extension.drawArraysInstancedANGLE(
      gl.TRIANGLES,
      0, // offset
      vertexCount, // num vertices per instance
      instanceCount, // num instances
    )
  }

  this.update = () => {
    bindBuffers()
  }
}

/**
 * @param {number} rectangleWidth - in pixel
 * @param {number} canvasWidth - in pixel
 * @param {number} count - amount of instances
 * @returns {Array}
 */
function getInstanceOffsets ({ rectangleWidth, canvasWidth, count }) {
  // normalize pixels to clipspace dimension
  const start = (rectangleWidth * 0.5 / canvasWidth) * clipSpaceRange
  const gap = (((canvasWidth - rectangleWidth) / (count - 1)) / (canvasWidth - rectangleWidth) - ((rectangleWidth / canvasWidth) / (count - 1))) * clipSpaceRange

  return Array.apply(null, Array(count)).map((_, index) => (-1 + start + (gap * index)))
}

/**
 * @param {number} rectangleWidth in pixel
 * @param {number} canvasWidth in pixel
 * @returns {Array}
 */
function getVertices ({ rectangleWidth, canvasWidth }) {
  // normalize pixels to clipspace dimension
  const width = (rectangleWidth / canvasWidth) * clipSpaceRange

  const x1 = width * -0.5
  const x2 = width * 0.5
  const y1 = 1.0
  const y2 = 0.0

  return [
    // left rectangle
    // |\
    // |_\
    x1, y1,
    x2, y2,
    x1, y2,

    // right rectangle
    // \‾|
    //  \|
    x1, y1,
    x2, y1,
    x2, y2,
  ]
}
