import React, { useRef, useEffect } from 'react';
import { Renderer, Program, Color, Mesh, Triangle } from 'ogl';

const vertex = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  
  uniform vec3 uHorizonColor;
  uniform vec3 uWaveColor;
  uniform vec3 uCrestColor;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform float uWaveScale;
  uniform float uWaveRatio;
  uniform float uSwell;
  uniform float uTurbulence;
  uniform float uTilt;
  uniform float uZoom;
  uniform float uHeight;
  uniform float uFogDepth;
  uniform float uBrightness;
  uniform float uOpacity;
  uniform float uGrainIntensity;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    
    // Parallax mouse effect
    vec2 p = uv * 2.0 - 1.0;
    p.x -= uMouse.x * 0.1;
    p.y -= uMouse.y * 0.1;
    
    // Basic wave simulation using sine waves
    float t = uTime * uSpeed;
    float wave = sin(p.x * uTurbulence + t) * uAmplitude;
    wave += cos(p.y * uWaveScale - t) * uSwell;
    
    // Mix colors based on wave height
    float crestHeight = clamp((wave + uHeight) / uZoom, 0.0, 1.0);
    vec3 color = mix(uHorizonColor, uWaveColor, p.y * uTilt);
    color = mix(color, uCrestColor, crestHeight * uWaveRatio);
    
    // Brightness and fog
    color *= uBrightness;
    float fog = clamp(p.y / uFogDepth, 0.0, 1.0);
    color = mix(color, uHorizonColor, fog);
    
    // Grain
    float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    color += noise * uGrainIntensity;
    
    gl_FragColor = vec4(color, uOpacity);
  }
`;

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? new Color(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ) : new Color(0, 0, 0);
};

export default function GradientWaves({
  horizonColor = "#07111F",
  waveColor = "#123C66",
  crestColor = "#4FD1FF",
  speed = 0.4,
  amplitude = 2.5,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 35,
  turbulence = 20,
  tilt = 1.11,
  zoom = 1.0,
  height = 5.5,
  fogDepth = 15,
  detail = "medium",
  brightness = 1.0,
  opacity = 0.85,
  mouseInteraction = true,
  parallaxStrength = 0.5,
  grain = true,
  grainIntensity = 0.03,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        uHorizonColor: { value: hexToRgb(horizonColor) },
        uWaveColor: { value: hexToRgb(waveColor) },
        uCrestColor: { value: hexToRgb(crestColor) },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uWaveScale: { value: waveScale },
        uWaveRatio: { value: waveRatio },
        uSwell: { value: swell },
        uTurbulence: { value: turbulence },
        uTilt: { value: tilt },
        uZoom: { value: zoom },
        uHeight: { value: height },
        uFogDepth: { value: fogDepth },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uMouse: { value: [0, 0] },
        uGrainIntensity: { value: grain ? grainIntensity : 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animationId;
    let targetMouse = [0, 0];
    let currentMouse = [0, 0];

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      if (!mouseInteraction) return;
      const rect = gl.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
      targetMouse = [x * parallaxStrength, y * parallaxStrength];
    };

    container.addEventListener('mousemove', handleMouseMove);

    const update = (t) => {
      animationId = requestAnimationFrame(update);
      
      currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.05;
      currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.05;
      
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uMouse.value = currentMouse;
      
      renderer.render({ scene: mesh });
    };

    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeChild(gl.canvas);
    };
  }, [
    horizonColor, waveColor, crestColor, speed, amplitude, waveScale,
    waveRatio, swell, turbulence, tilt, zoom, height, fogDepth,
    brightness, opacity, mouseInteraction, parallaxStrength, grain, grainIntensity
  ]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
}
