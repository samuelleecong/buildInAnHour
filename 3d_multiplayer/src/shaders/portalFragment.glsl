// Portal fragment shader
// Creates animated swirling effect with color mixing

uniform float time;
uniform vec3 color1;
uniform vec3 color2;

varying vec2 vUv;

void main() {
  // Center UV coordinates (-0.5 to 0.5)
  vec2 uv = vUv - 0.5;

  // Calculate distance from center for radial effect
  float dist = length(uv);

  // Calculate angle for rotation effect
  float angle = atan(uv.y, uv.x);

  // Create rotating spiral pattern
  float spiral = sin(angle * 8.0 + time * 2.0 - dist * 10.0);

  // Create pulsing wave from center
  float wave = sin(dist * 15.0 - time * 3.0);

  // Combine patterns
  float pattern = (spiral + wave) * 0.5;

  // Mix colors based on pattern
  vec3 color = mix(color1, color2, pattern * 0.5 + 0.5);

  // Add brightness falloff towards edges
  float brightness = 1.0 - smoothstep(0.0, 0.5, dist);
  color *= brightness;

  // Add slight glow in center
  float glow = 1.0 - smoothstep(0.0, 0.2, dist);
  color += glow * 0.3;

  gl_FragColor = vec4(color, 1.0);
}
