/**
 * @param {object} gl - webgl context
 * @param {object} extension - 'ANGLE_instanced_arrays' extension
 * @param {object} program - context program
 * @param {array} data - buffer data
 * @param {string} name - buffer name
 * @param {number} size - size of one vector
 * @param {boolean} instancedAttribute
 */
function WebglBuffer ({
  gl,
  extension,
  program,
  data,
  name,
  size,
  instancedAttribute = false,
} = {}) {
  const buffer = gl.createBuffer()
  const location = gl.getAttribLocation(program, name)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

  this.draw = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)

    if (extension && instancedAttribute) {
      extension.vertexAttribDivisorANGLE(location, 1)
    }
  }
}

export default WebglBuffer
