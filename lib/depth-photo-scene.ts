/**
 * Fixed-depth photograph.
 *
 * A photograph is drawn as a fine mesh whose vertices are pushed toward the
 * viewer by a grayscale depth map (lighter = closer). The camera stays centered
 * at one fixed position, preserving the three-dimensional scene without motion.
 *
 * The scene is decorative: the accessible image is the ordinary <img> underneath
 * it. The scene draws on load and when its container resizes. Pointer movement,
 * scrolling, and elapsed time never change the camera or the photograph.
 */

export type DepthSceneOptions = {
  /** Photograph URL. Use the same URL as the visible <img> so the browser reuses it. */
  src: string;
  /** Grayscale depth map URL, lighter = closer. Any resolution; it is sampled per vertex. */
  depthSrc: string;
  /** How far the nearest points come forward, in fractions of the image height. */
  strength?: number;
  /** Depth value (0..1) that stays pinned in place. Background values sit near 0. */
  focus?: number;
  /** Called once the first frame has drawn, so the canvas can be revealed. */
  onReady?: () => void;
  /** Called when the scene cannot run (no WebGL, image failure); the fallback image stays. */
  onUnavailable?: () => void;
};

export type DepthScene = {
  stop: () => void;
};

const VERTEX_SHADER = `
attribute vec2 aUv;
uniform mat4 uProj;
uniform mat4 uView;
uniform sampler2D uDepth;
uniform float uStrength;
uniform float uFocus;
uniform float uAspect;
uniform float uOverscan;
varying vec2 vUv;
void main() {
  float d = texture2D(uDepth, aUv).r;
  vUv = aUv;
  vec3 p = vec3((aUv.x - 0.5) * uAspect * uOverscan, (0.5 - aUv.y) * uOverscan, (d - uFocus) * uStrength);
  gl_Position = uProj * uView * vec4(p, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uColor;
void main() {
  gl_FragColor = texture2D(uColor, vUv);
}
`;

const CAMERA_DISTANCE = 4.0;
const NEAR = 0.1;
const FAR = 12.0;
const OVERSCAN = 1.06;
const GRID_COLUMNS = 320;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function buildGrid(columns: number, rows: number) {
  const vertices = new Float32Array((columns + 1) * (rows + 1) * 2);
  let k = 0;
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= columns; i++) {
      vertices[k++] = i / columns;
      vertices[k++] = j / rows;
    }
  }
  const indices = new Uint16Array(columns * rows * 6);
  k = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      const a = j * (columns + 1) + i;
      const b = a + 1;
      const c = a + columns + 1;
      const d = c + 1;
      indices[k++] = a; indices[k++] = c; indices[k++] = b;
      indices[k++] = b; indices[k++] = c; indices[k++] = d;
    }
  }
  return { vertices, indices };
}

/** Uploads an image, shrinking it first if the device cannot hold a texture that large. */
function createTexture(gl: WebGLRenderingContext, image: HTMLImageElement): WebGLTexture | null {
  const texture = gl.createTexture();
  if (!texture) return null;
  const maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
  let source: TexImageSource = image;
  if (image.naturalWidth > maxSize || image.naturalHeight > maxSize) {
    const scale = maxSize / Math.max(image.naturalWidth, image.naturalHeight);
    const scaled = document.createElement("canvas");
    scaled.width = Math.max(1, Math.floor(image.naturalWidth * scale));
    scaled.height = Math.max(1, Math.floor(image.naturalHeight * scale));
    const context = scaled.getContext("2d");
    if (!context) return null;
    context.drawImage(image, 0, 0, scaled.width, scaled.height);
    source = scaled;
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

/**
 * Off-axis frustum: the rectangle [left, right] x [bottom, top] on the z = 0
 * plane always fills the viewport, whatever the eye position, so only points
 * displaced toward the eye appear to move.
 */
function frustum(out: Float32Array, l: number, r: number, b: number, t: number, n: number, f: number) {
  out[0] = (2 * n) / (r - l); out[1] = 0; out[2] = 0; out[3] = 0;
  out[4] = 0; out[5] = (2 * n) / (t - b); out[6] = 0; out[7] = 0;
  out[8] = (r + l) / (r - l); out[9] = (t + b) / (t - b); out[10] = -(f + n) / (f - n); out[11] = -1;
  out[12] = 0; out[13] = 0; out[14] = (-2 * f * n) / (f - n); out[15] = 0;
}

export function createDepthScene(canvas: HTMLCanvasElement, options: DepthSceneOptions): DepthScene {
  const strength = options.strength ?? 0.34;
  const focus = options.focus ?? 0.12;

  const context =
    canvas.getContext("webgl", { antialias: true, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" }) ??
    (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
  if (!context) {
    options.onUnavailable?.();
    return { stop: () => undefined };
  }
  const gl: WebGLRenderingContext = context;

  let stopped = false;
  const cleanups: Array<() => void> = [];

  let ready = false;
  const onResize = () => {
    if (ready && !stopped) draw();
  };
  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(onResize);
    observer.observe(canvas);
    cleanups.push(() => observer.disconnect());
  } else {
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));
  }

  const onContextLost = (event: Event) => {
    event.preventDefault();
    ready = false;
    options.onUnavailable?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  cleanups.push(() => canvas.removeEventListener("webglcontextlost", onContextLost));

  const projection = new Float32Array(16);
  const view = new Float32Array(16);
  let program: WebGLProgram | null = null;
  let indexCount = 0;
  let imageAspect = 1;
  const uniforms: Record<string, WebGLUniformLocation | null> = {};

  function setUp(photo: HTMLImageElement, depth: HTMLImageElement): boolean {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return false;
    program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.bindAttribLocation(program, 0, "aUv");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);
    for (const name of ["uProj", "uView", "uDepth", "uColor", "uStrength", "uFocus", "uAspect", "uOverscan"]) {
      uniforms[name] = gl.getUniformLocation(program, name);
    }

    imageAspect = photo.naturalWidth / photo.naturalHeight;
    const grid = buildGrid(GRID_COLUMNS, Math.max(2, Math.round(GRID_COLUMNS / imageAspect)));
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, grid.vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, grid.indices, gl.STATIC_DRAW);
    indexCount = grid.indices.length;

    const colorTexture = createTexture(gl, photo);
    const depthTexture = createTexture(gl, depth);
    if (!colorTexture || !depthTexture) return false;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.uniform1i(uniforms.uColor, 0);
    gl.uniform1i(uniforms.uDepth, 1);
    gl.uniform1f(uniforms.uAspect, imageAspect);
    gl.uniform1f(uniforms.uOverscan, OVERSCAN);
    gl.uniform1f(uniforms.uFocus, focus);
    gl.uniform1f(uniforms.uStrength, strength);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.85, 0.87, 0.89, 1);
    return true;
  }

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function draw() {
    if (!program) return;
    resizeCanvas();
    const width = canvas.width;
    const height = canvas.height;
    gl.viewport(0, 0, width, height);
    // Cover the box the way object-fit: cover does: the visible window on the
    // z = 0 plane keeps the box's aspect and never exceeds the photograph.
    const boxAspect = width / height;
    const halfHeight = Math.min(0.5, (0.5 * imageAspect) / boxAspect);
    const halfWidth = halfHeight * boxAspect;
    const eyeX = 0;
    const eyeY = 0;
    const k = NEAR / CAMERA_DISTANCE;
    frustum(projection, (-halfWidth - eyeX) * k, (halfWidth - eyeX) * k, (-halfHeight - eyeY) * k, (halfHeight - eyeY) * k, NEAR, FAR);
    view.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -eyeX, -eyeY, -CAMERA_DISTANCE, 1]);
    gl.uniformMatrix4fv(uniforms.uProj, false, projection);
    gl.uniformMatrix4fv(uniforms.uView, false, view);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
  }

  Promise.all([loadImage(options.src), loadImage(options.depthSrc)])
    .then(([photo, depth]) => {
      if (stopped) return;
      if (!setUp(photo, depth)) {
        options.onUnavailable?.();
        return;
      }
      ready = true;
      draw();
      options.onReady?.();
    })
    .catch(() => {
      if (!stopped) options.onUnavailable?.();
    });

  return {
    stop() {
      stopped = true;
      for (const cleanup of cleanups) cleanup();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
