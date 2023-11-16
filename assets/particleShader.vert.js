export const vertex = /* glsl */ `

attribute vec2 a_position;
uniform vec2 u_resolution;

void main() {
  vec2 clipSpace = (a_position / u_resolution) * 2. - 1.;
  gl_Position = vec4(clipSpace, 0, 1);
  gl_PointSize = 5.0;
}
`;