export const vertex = /* glsl */ `

attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform vec2 u_resolution;

varying vec2 v_texcoord;

void main() {
  vec2 clipSpace = (a_position / u_resolution) * 2.;
  gl_Position = vec4(clipSpace, 0, 1);

  v_texcoord = a_texcoord;
}
`;