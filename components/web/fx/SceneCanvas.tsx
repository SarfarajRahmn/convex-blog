"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-written WebGL scene: an iridescent torus knot inside a particle shell.
 * It reacts to the pointer and to page scroll. No 3D library is needed.
 *
 * Rendering stops while the canvas is off screen or the tab is hidden, pixel
 * density is capped, and reduced-motion users get a single still frame.
 */

const KNOT_VERTEX = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;
uniform mat3 uRotation;
uniform vec2 uScale;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vUv;

void main() {
  float breathe = sin(uTime * 1.4 + aUv.x * 25.13) * 0.06;
  vec3 world = uRotation * (aPosition + aNormal * breathe);
  float depth = 11.5 - world.z;
  vNormal = uRotation * aNormal;
  vView = vec3(-world.xy, depth);
  vUv = aUv;
  gl_Position = vec4(world.xy * uScale, 1.0101 * depth - 0.201, depth);
}
`;

const KNOT_FRAGMENT = `
// Must match the vertex shader, which shares the uTime uniform.
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vUv;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float facing = max(dot(n, v), 0.0);
  float fresnel = pow(1.0 - facing, 2.2);

  // Thin-film style colour shift: depends on view angle and position.
  float shift = facing * 0.9 + vUv.x * 2.0 - uTime * 0.05;
  vec3 film = 0.5 + 0.5 * cos(6.28318 * (shift + vec3(0.0, 0.33, 0.67)));

  vec3 violet = vec3(0.43, 0.20, 0.95);
  vec3 pink = vec3(0.93, 0.28, 0.78);
  vec3 cyan = vec3(0.22, 0.72, 0.98);
  vec3 base = mix(violet, pink, 0.5 + 0.5 * sin(vUv.x * 6.28318 + uTime * 0.35));
  base = mix(base, cyan, smoothstep(0.35, 1.0, sin(vUv.x * 12.566 - uTime * 0.5)));

  vec3 keyLight = normalize(vec3(-0.5, 0.8, 0.65));
  vec3 rimLight = normalize(vec3(0.9, -0.35, 0.3));
  float diffuse = max(dot(n, keyLight), 0.0);
  float specKey = pow(max(dot(reflect(-keyLight, n), v), 0.0), 40.0);
  float specRim = pow(max(dot(reflect(-rimLight, n), v), 0.0), 18.0);

  vec3 color = base * (0.16 + 0.62 * diffuse);
  color = mix(color, film, 0.28 * fresnel + 0.1);
  color += cyan * fresnel * 0.75;
  color += vec3(1.0) * specKey * 0.95 + pink * specRim * 0.6;

  // Light bands travelling along the tube.
  float band = smoothstep(0.93, 1.0, sin(vUv.x * 150.8 - uTime * 2.2));
  color += mix(cyan, vec3(1.0), 0.4) * band * 0.22;

  gl_FragColor = vec4(color, 1.0);
}
`;

const DUST_VERTEX = `
attribute vec4 aPosition;
uniform mat3 uRotation;
uniform vec2 uScale;
uniform float uTime;
uniform float uPixelRatio;
varying float vAlpha;

void main() {
  vec3 world = uRotation * aPosition.xyz;
  float depth = 11.5 - world.z;
  float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + aPosition.w * 40.0);
  vAlpha = twinkle * smoothstep(18.0, 6.0, depth);
  gl_PointSize = (1.5 + aPosition.w * 3.0) * uPixelRatio * (11.5 / depth);
  gl_Position = vec4(world.xy * uScale, 1.0101 * depth - 0.201, depth);
}
`;

const DUST_FRAGMENT = `
precision mediump float;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
  // Premultiplied alpha, which is what the canvas compositor expects.
  gl_FragColor = vec4(vec3(0.66, 0.54, 1.0) * alpha, alpha);
}
`;

function buildKnot(segments: number, sides: number) {
  const P = 2;
  const Q = 3;
  const TUBE = 0.62;
  const data: number[] = [];
  const indices: number[] = [];

  const curve = (t: number) => {
    const r = 2 + Math.cos(Q * t);
    return [r * Math.cos(P * t), r * Math.sin(P * t), Math.sin(Q * t) * 1.15];
  };
  const normalize = (v: number[]) => {
    const length = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / length, v[1] / length, v[2] / length];
  };
  const cross = (a: number[], b: number[]) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const a = curve(t);
    const b = curve(t + 0.01);
    const tangent = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const binormal = normalize(
      cross(tangent, [a[0] + b[0], a[1] + b[1], a[2] + b[2]]),
    );
    const normal = normalize(cross(binormal, tangent));

    for (let j = 0; j <= sides; j++) {
      const angle = (j / sides) * Math.PI * 2;
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const n = [0, 1, 2].map((k) => c * normal[k] + s * binormal[k]);
      data.push(
        a[0] + n[0] * TUBE,
        a[1] + n[1] * TUBE,
        a[2] + n[2] * TUBE,
        n[0],
        n[1],
        n[2],
        i / segments,
        j / sides,
      );
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < sides; j++) {
      const a = i * (sides + 1) + j;
      const b = a + sides + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  return {
    vertices: new Float32Array(data),
    indices: new Uint16Array(indices),
  };
}

function buildDust(count: number) {
  const data = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 3.9 + Math.random() * 1.8;
    data[i * 4] = radius * Math.sin(phi) * Math.cos(theta);
    data[i * 4 + 1] = radius * Math.cos(phi);
    data[i * 4 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    data[i * 4 + 3] = Math.random();
  }
  return data;
}

/** Column-major rotation matrix for Rz * Rx * Ry. */
function rotation(x: number, y: number, z: number) {
  const cx = Math.cos(x);
  const sx = Math.sin(x);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  const cz = Math.cos(z);
  const sz = Math.sin(z);
  return new Float32Array([
    cz * cy - sz * sx * sy,
    sz * cy + cz * sx * sy,
    -cx * sy,
    -sz * cx,
    cz * cx,
    sx,
    cz * sy + sz * sx * cy,
    sz * sy - cz * sx * cy,
    cx * cy,
  ]);
}

function createProgram(
  gl: WebGLRenderingContext,
  vertex: string,
  fragment: string,
) {
  const program = gl.createProgram();
  if (!program) return null;

  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }

  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

export function SceneCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    const knotProgram = gl && createProgram(gl, KNOT_VERTEX, KNOT_FRAGMENT);
    const dustProgram = gl && createProgram(gl, DUST_VERTEX, DUST_FRAGMENT);
    if (!gl || !knotProgram || !dustProgram) {
      setFailed(true);
      return;
    }

    const small = window.matchMedia("(max-width: 768px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const knot = buildKnot(small ? 180 : 260, small ? 24 : 36);
    const dustCount = small ? 160 : 340;

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, knot.vertices, gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, knot.indices, gl.STATIC_DRAW);
    const dustBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dustBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, buildDust(dustCount), gl.STATIC_DRAW);

    const locate = (program: WebGLProgram) => ({
      position: gl.getAttribLocation(program, "aPosition"),
      rotation: gl.getUniformLocation(program, "uRotation"),
      scale: gl.getUniformLocation(program, "uScale"),
      time: gl.getUniformLocation(program, "uTime"),
    });
    const knotAt = {
      ...locate(knotProgram),
      normal: gl.getAttribLocation(knotProgram, "aNormal"),
      uv: gl.getAttribLocation(knotProgram, "aUv"),
    };
    const dustAt = {
      ...locate(dustProgram),
      pixelRatio: gl.getUniformLocation(dustProgram, "uPixelRatio"),
    };

    let pixelRatio = 1;
    let scaleX = 1;
    let scaleY = 1;
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0, scroll: window.scrollY };

    function draw(time: number) {
      if (!gl) return;
      eased.x += (pointer.x - eased.x) * 0.05;
      eased.y += (pointer.y - eased.y) * 0.05;
      eased.scroll += (window.scrollY - eased.scroll) * 0.08;
      const spin = eased.scroll * 0.0028;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Solid knot.
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.disable(gl.BLEND);
      gl.useProgram(knotProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      for (const [location, size, offset] of [
        [knotAt.position, 3, 0],
        [knotAt.normal, 3, 12],
        [knotAt.uv, 2, 24],
      ] as const) {
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 32, offset);
      }
      gl.uniformMatrix3fv(
        knotAt.rotation,
        false,
        rotation(
          -0.35 + eased.y * 0.5 + spin * 0.5,
          time * 0.22 + eased.x * 0.7 + spin,
          time * 0.06,
        ),
      );
      gl.uniform2f(knotAt.scale, scaleX, scaleY);
      gl.uniform1f(knotAt.time, time);
      gl.drawElements(
        gl.TRIANGLES,
        knot.indices.length,
        gl.UNSIGNED_SHORT,
        0,
      );
      gl.disableVertexAttribArray(knotAt.normal);
      gl.disableVertexAttribArray(knotAt.uv);

      // Particle shell, hidden where the knot is in front of it.
      gl.depthMask(false);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(dustProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, dustBuffer);
      gl.enableVertexAttribArray(dustAt.position);
      gl.vertexAttribPointer(dustAt.position, 4, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix3fv(
        dustAt.rotation,
        false,
        rotation(eased.y * 0.25, -time * 0.05 + eased.x * 0.3 - spin * 0.4, 0),
      );
      gl.uniform2f(dustAt.scale, scaleX, scaleY);
      gl.uniform1f(dustAt.time, time);
      gl.uniform1f(dustAt.pixelRatio, pixelRatio);
      gl.drawArrays(gl.POINTS, 0, dustCount);
    }

    let frame = 0;
    let visible = true;
    const start = performance.now();

    function loop(now: number) {
      draw((now - start) / 1000);
      frame = requestAnimationFrame(loop);
    }
    function sync() {
      cancelAnimationFrame(frame);
      if (still) draw(4);
      else if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!canvas) return;
      const { clientWidth: width, clientHeight: height } = canvas;
      if (!width || !height) return;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = width / height;
      const focal = 2.75 * Math.min(1, aspect);
      scaleX = focal / aspect;
      scaleY = focal;
      sync();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(canvas);

    function onPointerMove(event: PointerEvent) {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    }
    function onContextLost(event: Event) {
      event.preventDefault();
      cancelAnimationFrame(frame);
      setFailed(true);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", sync);
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteBuffer(dustBuffer);
      gl.deleteProgram(knotProgram);
      gl.deleteProgram(dustProgram);
    };
  }, []);

  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      {failed ? (
        <div className="orb-fallback absolute inset-[18%] rounded-full" />
      ) : (
        <canvas ref={canvasRef} className="size-full animate-in fade-in duration-1000" />
      )}
    </div>
  );
}
