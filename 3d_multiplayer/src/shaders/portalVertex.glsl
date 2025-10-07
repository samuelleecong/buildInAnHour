// Portal vertex shader
// Transforms vertices from model space to clip space
// Passes UV coordinates to fragment shader for texture mapping

varying vec2 vUv;

void main() {
  // Pass UV coordinates to fragment shader
  vUv = uv;

  // Transform vertex position to clip space
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
