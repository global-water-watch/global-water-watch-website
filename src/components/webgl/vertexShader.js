import snoise from './snoise'

const vertexShader = `
  uniform float u_delta;
  uniform float u_spread;

  attribute vec4 a_vertex;
  attribute vec4 a_index;
  attribute float a_offset;

  ${snoise}

  void main() {
    // density controls how many octaves are drawn
    // smaller means less octaves
    float density = 0.03; // 0.04;
    // float noise = snoise( vec3(u_delta - a_index * density) + vec3(a_offset, 0.0, 0.0) );
    float noise = snoise( vec3(-u_delta) + vec3(a_offset, 0.0, 0.0) );
    vec4 noise_position = vec4(1.0, noise * u_spread, 1.0, 1.0);

    vec4 offset_position = vec4(a_offset * 2.0, 0.0, 0.0, 1.0);

    gl_Position = (a_vertex + offset_position) * noise_position;
  }
`

export default vertexShader
