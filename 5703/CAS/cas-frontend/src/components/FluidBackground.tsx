import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// nightMode: true=deep blue-black night, false=Morandi day palette
const FluidBackground = ({ nightMode = false }: { nightMode?: boolean }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<any>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    class TouchTexture {
      width: number; height: number; size: number; maxAge: number;
      radius: number; speed: number; trail: any[]; last: any;
      canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; texture: THREE.Texture;

      constructor() {
        this.size = 64; this.width = this.height = this.size;
        this.maxAge = 64; this.radius = 0.25 * this.size;
        this.speed = 1 / this.maxAge; this.trail = []; this.last = null;
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width; this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d")!;
        this.ctx.fillStyle = "black"; this.ctx.fillRect(0, 0, this.width, this.height);
        this.texture = new THREE.Texture(this.canvas);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.generateMipmaps = false;
        this.texture.needsUpdate = true;
      }
      update() {
        this.clear();
        for (let i = this.trail.length - 1; i >= 0; i--) {
          const point = this.trail[i];
          let f = point.force * this.speed * (1 - point.age / this.maxAge);
          point.x += point.vx * f; point.y += point.vy * f; point.age++;
          if (point.age > this.maxAge) this.trail.splice(i, 1);
          else this.drawPoint(point);
        }
        this.texture.needsUpdate = true;
      }
      clear() {
        this.ctx.fillStyle = "black"; this.ctx.fillRect(0, 0, this.width, this.height);
      }
      addTouch(point: any) {
        let force = 0; let vx = 0; let vy = 0;
        if (this.last) {
          const dx = point.x - this.last.x; const dy = point.y - this.last.y;
          if (dx === 0 && dy === 0) return;
          const dd = dx * dx + dy * dy; let d = Math.sqrt(dd);
          vx = dx / d; vy = dy / d; force = Math.min(dd * 20000, 2.0);
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
      }
      drawPoint(point: any) {
        const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
        let intensity = 1;
        if (point.age < this.maxAge * 0.3) intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
        else {
          const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
          intensity = -t * (t - 2);
        }
        intensity *= point.force;
        let color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
        let offset = this.size * 5;
        this.ctx.shadowOffsetX = offset; this.ctx.shadowOffsetY = offset;
        this.ctx.shadowBlur = this.radius * 1; this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
        this.ctx.beginPath(); this.ctx.fillStyle = "rgba(255,0,0,1)";
        this.ctx.arc(pos.x - offset, pos.y - offset, this.radius, 0, Math.PI * 2); this.ctx.fill();
      }
    }

    class GradientBackground {
      sceneManager: any; mesh: THREE.Mesh | null; uniforms: any;
      constructor(sm: any) {
        this.sceneManager = sm; this.mesh = null;
        this.uniforms = {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uColor1: { value: new THREE.Vector3(0.388, 0.400, 0.945) },
          uColor2: { value: new THREE.Vector3(0.055, 0.647, 0.914) },
          uColor3: { value: new THREE.Vector3(0.925, 0.282, 0.600) },
          uColor4: { value: new THREE.Vector3() },
          uColor5: { value: new THREE.Vector3() },
          uColor6: { value: new THREE.Vector3() },
          uSpeed: { value: 1.5 }, uIntensity: { value: 1.4 },
          uTouchTexture: { value: null }, uGrainIntensity: { value: 0.06 },
          uZoom: { value: 1.0 }, uDarkNavy: { value: new THREE.Vector3(0.01, 0.01, 0.05) },
          uGradientSize: { value: 0.45 }, uGradientCount: { value: 12.0 },
          uColor1Weight: { value: 0.45 }, uColor2Weight: { value: 1.2 }
        };
      }
      init() {
        const viewSize = this.sceneManager.getViewSize();
        const geo = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
        const mat = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: `varying vec2 vUv; void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); vUv = uv; }`,
          fragmentShader: `
            uniform float uTime; uniform vec2 uResolution;
            uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
            uniform vec3 uColor4; uniform vec3 uColor5; uniform vec3 uColor6;
            uniform float uSpeed; uniform float uIntensity; uniform sampler2D uTouchTexture;
            uniform float uGrainIntensity; uniform vec3 uDarkNavy;
            uniform float uGradientSize; uniform float uGradientCount;
            uniform float uColor1Weight; uniform float uColor2Weight;
            varying vec2 vUv;
            
            float grain(vec2 uv, float time) {
              return fract(sin(dot(uv * uResolution * 0.5 + time, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
            }
            
            vec3 getGradient(vec2 uv, float time) {
              float gRad = uGradientSize;
              vec2 c1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
              vec2 c2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
              vec2 c3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
              vec2 c4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
              vec2 c5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
              vec2 c6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
              vec2 c7 = vec2(0.5 + sin(time * uSpeed * 0.55) * 0.38, 0.5 + cos(time * uSpeed * 0.48) * 0.42);
              vec2 c8 = vec2(0.5 + cos(time * uSpeed * 0.65) * 0.36, 0.5 + sin(time * uSpeed * 0.52) * 0.44);
              vec2 c9 = vec2(0.5 + sin(time * uSpeed * 0.42) * 0.41, 0.5 + cos(time * uSpeed * 0.58) * 0.39);
              vec2 c10 = vec2(0.5 + cos(time * uSpeed * 0.48) * 0.37, 0.5 + sin(time * uSpeed * 0.62) * 0.43);
              vec2 c11 = vec2(0.5 + sin(time * uSpeed * 0.68) * 0.33, 0.5 + cos(time * uSpeed * 0.44) * 0.46);
              vec2 c12 = vec2(0.5 + cos(time * uSpeed * 0.38) * 0.39, 0.5 + sin(time * uSpeed * 0.56) * 0.41);
              
              float i1 = 1.0 - smoothstep(0.0, gRad, length(uv - c1));
              float i2 = 1.0 - smoothstep(0.0, gRad, length(uv - c2));
              float i3 = 1.0 - smoothstep(0.0, gRad, length(uv - c3));
              float i4 = 1.0 - smoothstep(0.0, gRad, length(uv - c4));
              float i5 = 1.0 - smoothstep(0.0, gRad, length(uv - c5));
              float i6 = 1.0 - smoothstep(0.0, gRad, length(uv - c6));
              float i7 = 1.0 - smoothstep(0.0, gRad, length(uv - c7));
              float i8 = 1.0 - smoothstep(0.0, gRad, length(uv - c8));
              float i9 = 1.0 - smoothstep(0.0, gRad, length(uv - c9));
              float i10 = 1.0 - smoothstep(0.0, gRad, length(uv - c10));
              float i11 = 1.0 - smoothstep(0.0, gRad, length(uv - c11));
              float i12 = 1.0 - smoothstep(0.0, gRad, length(uv - c12));
              
              vec2 rotUv1 = uv - 0.5;
              float a1 = time * uSpeed * 0.15;
              rotUv1 = vec2(rotUv1.x * cos(a1) - rotUv1.y * sin(a1), rotUv1.x * sin(a1) + rotUv1.y * cos(a1)) + 0.5;
              vec2 rotUv2 = uv - 0.5;
              float a2 = -time * uSpeed * 0.12;
              rotUv2 = vec2(rotUv2.x * cos(a2) - rotUv2.y * sin(a2), rotUv2.x * sin(a2) + rotUv2.y * cos(a2)) + 0.5;
              
              float r1 = 1.0 - smoothstep(0.0, 0.8, length(rotUv1 - 0.5));
              float r2 = 1.0 - smoothstep(0.0, 0.8, length(rotUv2 - 0.5));
              
              vec3 c = vec3(0.0);
              c += uColor1 * i1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
              c += uColor2 * i2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
              c += uColor3 * i3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
              c += uColor4 * i4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
              c += uColor5 * i5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
              c += uColor6 * i6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;
              
              if (uGradientCount > 6.0) {
                c += uColor1 * i7 * (0.55 + 0.45 * sin(time * uSpeed * 1.4)) * uColor1Weight;
                c += uColor2 * i8 * (0.55 + 0.45 * cos(time * uSpeed * 1.5)) * uColor2Weight;
                c += uColor3 * i9 * (0.55 + 0.45 * sin(time * uSpeed * 1.6)) * uColor1Weight;
                c += uColor4 * i10 * (0.55 + 0.45 * cos(time * uSpeed * 1.7)) * uColor2Weight;
              }
              if (uGradientCount > 10.0) {
                c += uColor5 * i11 * (0.55 + 0.45 * sin(time * uSpeed * 1.8)) * uColor1Weight;
                c += uColor6 * i12 * (0.55 + 0.45 * cos(time * uSpeed * 1.9)) * uColor2Weight;
              }
              
              c += mix(uColor1, uColor3, r1) * 0.45 * uColor1Weight;
              c += mix(uColor2, uColor4, r2) * 0.4 * uColor2Weight;
              
              c = clamp(c, vec3(0.0), vec3(1.0)) * uIntensity;
              c = mix(vec3(dot(c, vec3(0.299, 0.587, 0.114))), c, 1.35);
              c = pow(c, vec3(0.92));
              c = mix(uDarkNavy, c, max(length(c) * 1.2, 0.15));
              
              float len = length(c);
              if (len > 1.0) c *= (1.0 / len);
              return c;
            }
            
            void main() {
              vec2 uv = vUv;
              vec4 tTex = texture2D(uTouchTexture, uv);
              float intensity = tTex.b;
              uv.x += -(tTex.r * 2.0 - 1.0) * 0.8 * intensity;
              uv.y += -(tTex.g * 2.0 - 1.0) * 0.8 * intensity;
              
              float d = length(uv - 0.5);
              uv += vec2(sin(d * 20.0 - uTime * 3.0) * 0.04 * intensity + sin(d * 15.0 - uTime * 2.0) * 0.03 * intensity);
              
              vec3 color = getGradient(uv, uTime);
              color += grain(uv, uTime) * uGrainIntensity;
              
              float t = uTime * 0.5;
              color += vec3(sin(t)*0.02, cos(t*1.4)*0.02, sin(t*1.2)*0.02);
              
              color = mix(uDarkNavy, color, max(length(color) * 1.2, 0.15));
              color = clamp(color, vec3(0.0), vec3(1.0));
              gl_FragColor = vec4(color, 1.0);
            }
          `
        });
        this.mesh = new THREE.Mesh(geo, mat);
        this.sceneManager.scene.add(this.mesh);
      }
      onResize() {
        if (!this.mesh) return;
        const vs = this.sceneManager.getViewSize();
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.PlaneGeometry(vs.width, vs.height, 1, 1);
        this.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      }
    }

    class AppManager {
      renderer: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera;
      scene: THREE.Scene; clock: THREE.Clock;
      touchTexture: TouchTexture; gradientBackground: GradientBackground;
      animId: number; _hR: any; _hM: any; _hT: any;

      constructor(container: HTMLElement) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 50;
        this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(0x050015);
        this.clock = new THREE.Clock();
        this.touchTexture = new TouchTexture();
        this.gradientBackground = new GradientBackground(this);
        this.gradientBackground.uniforms.uTouchTexture.value = this.touchTexture.texture;
        this.animId = 0;

        this._hR = () => {
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.gradientBackground.onResize();
        };
        this._hM = (e: MouseEvent) => {
          this.touchTexture.addTouch({ x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight });
        };
        this._hT = (e: TouchEvent) => {
          this.touchTexture.addTouch({ x: e.touches[0].clientX / window.innerWidth, y: 1 - e.touches[0].clientY / window.innerHeight });
        };

        this.gradientBackground.init();
        window.addEventListener("resize", this._hR);
        window.addEventListener("mousemove", this._hM);
        window.addEventListener("touchmove", this._hT);
        this.tick();
      }

      // Set color palette based on mode
      applyPalette(night: boolean) {
        const u = this.gradientBackground.uniforms;
        if (night) {
          // Night mode: deep blue-black tones
          u.uColor1.value.set(0.10, 0.08, 0.25);
          u.uColor2.value.set(0.04, 0.10, 0.20);
          u.uColor3.value.set(0.06, 0.18, 0.22);
          u.uColor4.value.set(0.12, 0.06, 0.28);
          u.uColor5.value.set(0.03, 0.08, 0.18);
          u.uColor6.value.set(0.05, 0.15, 0.20);
          u.uIntensity.value = 1.0;
          u.uColor1Weight.value = 0.35;
          u.uColor2Weight.value = 0.8;
          u.uGrainIntensity.value = 0.03;
        } else {
          // Day mode: Morandi palette — muted, low-saturation, elegant
          u.uColor1.value.set(0.72, 0.55, 0.55); // dusty rose
          u.uColor2.value.set(0.55, 0.62, 0.55); // sage green
          u.uColor3.value.set(0.62, 0.58, 0.52); // warm taupe
          u.uColor4.value.set(0.50, 0.55, 0.68); // muted blue
          u.uColor5.value.set(0.65, 0.55, 0.65); // soft lavender
          u.uColor6.value.set(0.58, 0.60, 0.50); // dusty olive
          u.uIntensity.value = 1.3;
          u.uColor1Weight.value = 0.45;
          u.uColor2Weight.value = 1.0;
          u.uGrainIntensity.value = 0.05;
        }
      }

      getViewSize() {
        const f = (this.camera.fov * Math.PI) / 180;
        const h = Math.abs(this.camera.position.z * Math.tan(f / 2) * 2);
        return { width: h * this.camera.aspect, height: h };
      }

      tick() {
        let d = Math.min(this.clock.getDelta(), 0.1);
        this.touchTexture.update();
        if (this.gradientBackground.uniforms.uTime) this.gradientBackground.uniforms.uTime.value += d;
        this.renderer.render(this.scene, this.camera);
        this.animId = requestAnimationFrame(() => this.tick());
      }

      dispose() {
        window.removeEventListener("resize", this._hR);
        window.removeEventListener("mousemove", this._hM);
        window.removeEventListener("touchmove", this._hT);
        cancelAnimationFrame(this.animId);
        this.renderer.dispose();
        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
      }
    }

    appRef.current = new AppManager(mountRef.current);

    return () => { appRef.current?.dispose(); };
  }, []);

  // Apply palette on mount and when nightMode changes
  useEffect(() => {
    if (appRef.current) {
      appRef.current.applyPalette(nightMode);
    }
  }, [nightMode]);

  return <div ref={mountRef} id="webGLApp" className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default FluidBackground;
