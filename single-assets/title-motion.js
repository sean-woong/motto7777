(() => {
  'use strict';
  const word = document.querySelector('.word');
  const image = word?.querySelector('img');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!image || new URLSearchParams(location.search).get('motion') === 'off') return;

  // Render the wave directly: avoids dynamically refreshed SVG feImage filters
  // on Safari. Keep the original accessible image as the failure/reduced-motion fallback.
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:none';
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
  if (!gl) return;
  function shader(type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error('Wave shader unavailable');
    return result;
  }
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, `attribute vec2 position; varying vec2 uv;
      void main(){uv=vec2((position.x+1.0)*0.5,(1.0-position.y)*0.5);gl_Position=vec4(position,0.0,1.0);}`));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, `precision highp float;
      varying vec2 uv; uniform sampler2D artwork; uniform vec2 size;
      uniform vec4 crop; uniform float phase; uniform float amplitude;
      void main(){
        float ex=clamp(min(uv.x,1.0-uv.x)/0.0472,0.0,1.0);
        float ey=clamp(min(uv.y,1.0-uv.y)/0.0635,0.0,1.0);
        vec2 wave=vec2(sin(uv.y*12.5663706+phase)*0.5*ex,
                       sin(uv.x*18.8495559-phase)*0.298*ey);
        vec2 at=uv+wave*amplitude/size;
        if(at.x<0.0||at.x>1.0||at.y<0.0||at.y>1.0){gl_FragColor=vec4(0.0);return;}
        gl_FragColor=texture2D(artwork,crop.xy+at*crop.zw);
      }`));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  } catch { return; }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const uniforms = Object.fromEntries(['size','crop','phase','amplitude'].map(name => [name, gl.getUniformLocation(program,name)]));
  let ready = false;
  let visible = false;
  let frame = 0;
  let lost = false;
  word.append(canvas);

  function fallback() {
    canvas.style.display = 'none';
    image.style.removeProperty('opacity');
  }
  function render() {
    frame = 0;
    if (!ready || lost || reduced.matches || document.hidden) { fallback(); return; }
    if (!visible) return;
    const box = word.getBoundingClientRect();
    const img = image.getBoundingClientRect();
    if (!box.width || !img.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const width = Math.round(box.width*dpr), height = Math.round(box.height*dpr);
    if (canvas.width !== width || canvas.height !== height) {canvas.width=width;canvas.height=height;}
    gl.viewport(0,0,width,height);
    gl.uniform2f(uniforms.size,box.width,box.height);
    gl.uniform4f(uniforms.crop,(box.left-img.left)/img.width,(box.top-img.top)/img.height,box.width/img.width,box.height/img.height);
    gl.uniform1f(uniforms.phase,window.scrollY*Math.PI*2/600);
    gl.uniform1f(uniforms.amplitude,innerWidth<=650?16:30);
    gl.drawArrays(gl.TRIANGLES,0,6);
    canvas.style.display='block';
    image.style.opacity='0';
  }
  function schedule() { if (!frame) frame=requestAnimationFrame(render); }
  function upload() {
    if (!image.naturalWidth || lost) return;
    try {
      gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
      ready=true;
      schedule();
    } catch { fallback(); }
  }
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;fallback();
  });
  // Restore gracefully as a static image if the browser discards the graphics context.
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();}).observe(word);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  window.visualViewport?.addEventListener('scroll',schedule,{passive:true});
  window.visualViewport?.addEventListener('resize',schedule);
  reduced.addEventListener('change',schedule);
  document.addEventListener('visibilitychange',schedule);
  image.addEventListener('load',upload,{once:true});
  if(image.complete) upload();
})();
