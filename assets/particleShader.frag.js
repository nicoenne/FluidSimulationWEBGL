export const vertex = /* glsl */ `

#extension GL_OES_standard_derivatives : enable

precision mediump float;

varying vec2 v_texcoord;

void main() {
  vec2 centreOffset = (v_texcoord - 0.5) * 2.0;
  float sqrDstFromCentre = dot(centreOffset, centreOffset);
  float delta = fwidth(sqrt(sqrDstFromCentre));
  float circleAlpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, sqrDstFromCentre);

  gl_FragColor = vec4(0.0, 0.0, 1.0, circleAlpha);

}
`;