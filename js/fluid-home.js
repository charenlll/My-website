// Original procedural flow shader; no external assets or simulation dependency.
(() => {
const canvas=document.getElementById('fluid-canvas'),button=document.getElementById('motion-toggle');
if(!canvas||!button)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 767px)');
let paused=reduced.matches||mobile.matches,visible=true,frame=0,time=0,last=0,disposed=false;
const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
if(!gl){canvas.hidden=true;button.textContent='静态背景';button.disabled=true;return;}
const vertex='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const fragment=`precision mediump float;
uniform vec2 resolution;uniform float time;uniform vec2 pointer;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*noise(p);p=m*p*2.04+1.7;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/resolution;vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.)*2.5;
float t=time*.055;vec2 mouse=(pointer-.5)*.12;
vec2 q=vec2(fbm(p+vec2(t,-t*.3)),fbm(p+vec2(4.2,1.3)-t*.4));
vec2 r=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*.25+mouse),fbm(p+3.*q+vec2(8.3,2.8)-t*.2));
float f=fbm(p+3.7*r);float ribbon=pow(.5+.5*sin(f*20.+r.x*5.),7.);
vec3 dark=vec3(.052,.048,.074),wine=vec3(.32,.115,.22),violet=vec3(.22,.21,.34);
vec3 col=mix(dark,wine,smoothstep(.23,.8,r.x)*.8);col=mix(col,violet,smoothstep(.25,.8,q.y)*.62);
col+=ribbon*vec3(.19,.09,.15)*smoothstep(.1,.8,length(uv-.5));
float center=1.-smoothstep(.05,.65,length((uv-.5)*vec2(1.,1.2)));col*=1.-center*.35;
col+= (hash(gl_FragCoord.xy)-.5)*.008;gl_FragColor=vec4(col,1.);}`;
function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Shader compilation failed');return shader;}
let program;
try{program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader link failed');}catch{canvas.hidden=true;button.textContent='静态背景';button.disabled=true;return;}
gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const attr=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
const locR=gl.getUniformLocation(program,'resolution'),locT=gl.getUniformLocation(program,'time'),locP=gl.getUniformLocation(program,'pointer');let mx=.5,my=.5;
function draw(){if(disposed)return;gl.uniform2f(locR,canvas.width,canvas.height);gl.uniform1f(locT,time);gl.uniform2f(locP,mx,my);gl.drawArrays(gl.TRIANGLES,0,6);}
function resize(){const scale=Math.min(devicePixelRatio,1)*.7;canvas.width=Math.round(canvas.clientWidth*scale);canvas.height=Math.round(canvas.clientHeight*scale);gl.viewport(0,0,canvas.width,canvas.height);draw();}
function loop(now){frame=0;if(paused||!visible||document.hidden||disposed){last=0;return;}if(now-last>=33){time+=last?Math.min((now-last)/1000,.1):0;last=now;draw();}frame=requestAnimationFrame(loop);}
function start(){if(!frame&&!paused&&visible&&!document.hidden&&!disposed)frame=requestAnimationFrame(loop);}
function label(){button.textContent=paused?'动态效果：关闭':'动态效果：开启';button.setAttribute('aria-pressed',String(!paused));}
button.addEventListener('click',()=>{paused=!paused;label();if(paused){cancelAnimationFrame(frame);frame=0;last=0;}else start();});
reduced.addEventListener('change',()=>{paused=reduced.matches;label();if(paused){cancelAnimationFrame(frame);frame=0;}else start();});
canvas.parentElement.addEventListener('pointermove',e=>{if(paused||e.pointerType!=='mouse')return;const r=canvas.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=1-(e.clientY-r.top)/r.height;});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();},{threshold:0}).observe(canvas);
document.addEventListener('visibilitychange',start);window.addEventListener('resize',resize);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();disposed=true;cancelAnimationFrame(frame);canvas.hidden=true;button.disabled=true;button.textContent='静态背景';});
resize();label();start();
})();
