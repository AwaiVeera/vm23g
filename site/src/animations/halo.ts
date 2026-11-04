import { motionAllowed } from '@/systems/motion';

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform vec2 c;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 uv=gl_FragCoord.xy/r;float a=r.x/r.y;
  vec2 q=vec2((uv.x-c.x)*a,uv.y-c.y);
  q-=m*0.035;
  float d=length(q);
  float breathe=0.5+0.5*sin(t*0.32);
  vec3 canvas=vec3(0.031,0.051,0.035);
  vec3 olive=vec3(0.408,0.451,0.278);
  vec3 gold=vec3(0.78,0.643,0.353);
  float halo=exp(-d*d*(5.2-breathe*1.2));
  float core=exp(-d*d*16.);
  vec3 col=canvas;
  col+=olive*halo*0.34;
  col+=gold*core*(0.12+0.07*breathe);
  float fog=n(vec2(q.x*2.2+t*0.018,q.y*2.2-t*0.012));
  col+=olive*fog*halo*0.10;
  float band=uv.x*0.9+uv.y*0.35-mod(t*0.045,2.4)+0.7;
  col+=gold*exp(-band*band*90.)*halo*0.10;
  vec2 g=vec2(uv.x*a*90.,uv.y*90.+t*1.6);
  vec2 cell=floor(g);vec2 f=fract(g)-0.5;
  float rnd=h(cell);
  float mote=step(0.985,rnd)*smoothstep(0.09,0.0,length(f+vec2(0.,(rnd-0.5)*0.6)));
  float tw=0.5+0.5*sin(t*1.7+rnd*40.);
  col+=gold*mote*tw*(0.18+halo*0.55);
  float v=smoothstep(1.25,0.25,length((uv-0.5)*vec2(a*0.9,1.)));
  col*=mix(0.55,1.,v);
  gl_FragColor=vec4(col,1.);
}`;

export function mountHalo(canvas: HTMLCanvasElement, getCenter: () => [number, number]) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', premultipliedAlpha: false });
  if (!gl) return;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uR = gl.getUniformLocation(prog, 'r');
  const uT = gl.getUniformLocation(prog, 't');
  const uM = gl.getUniformLocation(prog, 'm');
  const uC = gl.getUniformLocation(prog, 'c');

  const small = window.matchMedia('(max-width: 720px)').matches;
  const scale = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.25) * (small ? 0.6 : 0.75);

  let w = 0;
  let h = 0;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(rect.width * scale));
    h = Math.max(1, Math.round(rect.height * scale));
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    if (!running && shown) draw(performance.now());
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );

  let visible = true;
  let running = false;
  let raf = 0;
  let last = performance.now();
  let clock = 8;
  let shown = false;

  const draw = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += dt;
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    const [cx, cy] = getCenter();
    gl.uniform2f(uR, w, h);
    gl.uniform1f(uT, clock);
    gl.uniform2f(uM, pointer.x, pointer.y);
    gl.uniform2f(uC, cx, cy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!shown) {
      shown = true;
      canvas.classList.add('is-ready');
    }
  };

  resize();

  const loop = (now: number) => {
    draw(now);
    raf = requestAnimationFrame(loop);
  };

  const update = () => {
    cancelAnimationFrame(raf);
    running = visible && !document.hidden && motionAllowed();
    draw(performance.now());
    if (running) raf = requestAnimationFrame(loop);
  };

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }).observe(canvas);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('vm23g:motion', update);
  update();
}
