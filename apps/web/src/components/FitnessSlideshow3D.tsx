'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Pause,
  Play,
  SlidersHorizontal,
} from 'lucide-react';
import { FITNESS_EVENTS, FitnessEvent } from '@/data/fitness-events';
import { cn } from '@/lib/utils';

interface FitnessSlideshow3DProps {
  events?: FitnessEvent[];
  onInspectEvent?: (event: FitnessEvent) => void;
  registeredIds?: string[];
  onToggleRegister?: (eventId: string) => void;
}

const TEMP_VEC3 = new THREE.Vector3();
const TEMP_POINTER = new THREE.Vector2();

function detectSoftwareWebGL(renderer: THREE.WebGLRenderer): boolean {
  try {
    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const unmasked = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '');
      if (/SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(unmasked)) {
        return true;
      }
    }
    const rendererStr = String(gl.getParameter(gl.RENDERER) || '');
    return /SwiftShader|llvmpipe|softpipe|Software/i.test(rendererStr);
  } catch {
    return false;
  }
}

export function FitnessSlideshow3D({
  events = FITNESS_EVENTS,
  onInspectEvent,
  registeredIds = [],
  onToggleRegister,
}: FitnessSlideshow3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [focus3DMode, setFocus3DMode] = useState(false);
  const [webglFallback, setWebglFallback] = useState(false);

  const activeIndexRef = useRef(0);
  const targetParallaxRef = useRef({ x: 0, y: 0 });
  const dragDeltaRef = useRef(0);
  const dragStartRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const stepSlide = useCallback(
    (delta: number) => {
      setActiveIndex((prev) => (prev + delta + events.length) % events.length);
    },
    [events.length]
  );

  useEffect(() => {
    if (!autoPlay) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % events.length);
    }, 6200);
    return () => window.clearInterval(id);
  }, [autoPlay, events.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setAutoPlay(false);
        stepSlide(1);
      } else if (e.key === 'ArrowLeft') {
        setAutoPlay(false);
        stepSlide(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stepSlide]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setWebglFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const isSoftwareGl = detectSoftwareWebGL(renderer);
    if (isSoftwareGl) {
      renderer.dispose();
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: false,
          powerPreference: 'default',
        });
      } catch {
        setWebglFallback(true);
        return;
      }
    }

    const activeRenderer = renderer;
    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 480);

    activeRenderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    activeRenderer.setSize(width, height);
    activeRenderer.outputColorSpace = THREE.SRGBColorSpace;
    activeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    activeRenderer.toneMappingExposure = 1.08;
    activeRenderer.shadowMap.enabled = !isSoftwareGl;
    if (!isSoftwareGl) {
      activeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    activeRenderer.domElement.style.display = 'block';
    activeRenderer.domElement.style.width = '100%';
    activeRenderer.domElement.style.height = '100%';
    activeRenderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(activeRenderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.044);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 60);
    const updateCameraRig = (w: number, h: number) => {
      camera.aspect = w / h;
      const isNarrow = w < 900;
      camera.position.set(isNarrow ? 0 : -0.85, isNarrow ? 1.15 : 1.0, isNarrow ? 9.8 : 8.4);
      camera.updateProjectionMatrix();
    };
    updateCameraRig(width, height);

    const pmremGenerator = new THREE.PMREMGenerator(activeRenderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();

    const hemiLight = new THREE.HemisphereLight(0xaec8ff, 0x161922, 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.2);
    keyLight.position.set(4.5, 6.5, 6.0);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 24;
    }
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xc0ff00, 3.8, 16, 1.8);
    rimLight.position.set(-2.5, 2.8, 3.2);
    scene.add(rimLight);

    const floorGeo = new THREE.CircleGeometry(14, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0d0f14,
      roughness: 0.78,
      metalness: 0.22,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.72;
    if (!isSoftwareGl) floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const grid = new THREE.GridHelper(24, 32, 0x2a3140, 0x161a22);
    grid.position.y = -1.71;
    scene.add(grid);

    const ringGeo = new THREE.RingGeometry(4.4, 4.46, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc0ff00,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const stageRing = new THREE.Mesh(ringGeo, ringMat);
    stageRing.rotation.x = -Math.PI / 2;
    stageRing.position.y = -1.7;
    scene.add(stageRing);

    const textureLoader = new THREE.TextureLoader();
    const maxAniso = Math.min(activeRenderer.capabilities.getMaxAnisotropy(), 8);
    const loadedTextures: THREE.Texture[] = [];
    const disposableGeometries: THREE.BufferGeometry[] = [floorGeo, ringGeo];
    const disposableMaterials: THREE.Material[] = [floorMat, ringMat];

    const chassisGeo = new THREE.BoxGeometry(4.06, 2.58, 0.14);
    const innerMatGeo = new THREE.BoxGeometry(3.9, 2.42, 0.15);
    const photoGeo = new THREE.PlaneGeometry(3.76, 2.28);
    const railGeo = new THREE.BoxGeometry(0.055, 2.28, 0.17);
    const neonBarGeo = new THREE.BoxGeometry(2.2, 0.036, 0.165);

    disposableGeometries.push(chassisGeo, innerMatGeo, photoGeo, railGeo, neonBarGeo);

    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1a1d24,
      metalness: 0.86,
      roughness: 0.28,
    });
    const innerMatMaterial = new THREE.MeshStandardMaterial({
      color: 0x0b0c10,
      metalness: 0.25,
      roughness: 0.78,
    });
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x8b95a8,
      metalness: 0.92,
      roughness: 0.22,
    });
    disposableMaterials.push(chassisMat, innerMatMaterial, railMat);

    interface SlideRig {
      group: THREE.Group;
      photoMat: THREE.MeshStandardMaterial;
      neonMat: THREE.MeshStandardMaterial;
      index: number;
    }

    const slideRigs: SlideRig[] = events.map((ev, idx) => {
      const group = new THREE.Group();
      group.userData.slideIndex = idx;

      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      if (!isSoftwareGl) chassis.castShadow = true;
      group.add(chassis);

      const innerFrame = new THREE.Mesh(innerMatGeo, innerMatMaterial);
      group.add(innerFrame);

      const leftRail = new THREE.Mesh(railGeo, railMat);
      leftRail.position.x = -2.01;
      group.add(leftRail);

      const rightRail = new THREE.Mesh(railGeo, railMat);
      rightRail.position.x = 2.01;
      group.add(rightRail);

      const tex = textureLoader.load(ev.img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      loadedTextures.push(tex);

      const photoMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.36,
        metalness: 0.06,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: tex,
        emissiveIntensity: 0.24,
      });
      disposableMaterials.push(photoMat);

      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.z = 0.082;
      photoMesh.userData.slideIndex = idx;
      group.add(photoMesh);

      const neonMat = new THREE.MeshStandardMaterial({
        color: 0xc0ff00,
        emissive: 0xc0ff00,
        emissiveIntensity: idx === 0 ? 1.8 : 0.06,
        roughness: 0.2,
        metalness: 0.1,
      });
      disposableMaterials.push(neonMat);

      const neonBar = new THREE.Mesh(neonBarGeo, neonMat);
      neonBar.position.set(0, -1.24, 0.04);
      group.add(neonBar);

      scene.add(group);
      return { group, photoMat, neonMat, index: idx };
    });

    const raycaster = new THREE.Raycaster();
    const domEl = activeRenderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      dragStartRef.current = { x: e.clientX, y: e.clientY, moved: false };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = domEl.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetParallaxRef.current = { x: nx, y: ny };

      if (dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        if (Math.abs(dx) > 10) {
          dragStartRef.current.moved = true;
          dragDeltaRef.current = THREE.MathUtils.clamp(dx * 0.004, -0.8, 0.8);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const start = dragStartRef.current;
      dragStartRef.current = null;
      dragDeltaRef.current = 0;

      if (start) {
        const dx = e.clientX - start.x;
        if (Math.abs(dx) > 48) {
          setAutoPlay(false);
          stepSlide(dx < 0 ? 1 : -1);
          return;
        }
        if (!start.moved) {
          const rect = domEl.getBoundingClientRect();
          TEMP_POINTER.set(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
          );
          raycaster.setFromCamera(TEMP_POINTER, camera);
          const hits = raycaster.intersectObjects(
            slideRigs.map((s) => s.group),
            true
          );
          if (hits.length > 0) {
            const hitObj = hits[0].object;
            const clickedIdx =
              hitObj.userData.slideIndex ?? hitObj.parent?.userData.slideIndex;
            if (typeof clickedIdx === 'number' && clickedIdx !== activeIndexRef.current) {
              setAutoPlay(false);
              setActiveIndex(clickedIdx);
            }
          }
        }
      }
    };

    const onPointerLeave = () => {
      targetParallaxRef.current = { x: 0, y: 0 };
      dragStartRef.current = null;
      dragDeltaRef.current = 0;
    };

    domEl.addEventListener('pointerdown', onPointerDown);
    domEl.addEventListener('pointermove', onPointerMove);
    domEl.addEventListener('pointerup', onPointerUp);
    domEl.addEventListener('pointerleave', onPointerLeave);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setWebglFallback(true);
    };
    domEl.addEventListener('webglcontextlost', onContextLost);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 320);
        const h = Math.max(entry.contentRect.height, 480);
        activeRenderer.setSize(w, h);
        updateCameraRig(w, h);
      }
    });
    ro.observe(container);

    let rafId = 0;
    let disposed = false;
    let lastTime = performance.now();

    const afterDraw = (cb: () => void) => {
      if (isSoftwareGl) {
        const gl = activeRenderer.getContext() as WebGL2RenderingContext;
        if (typeof gl.fenceSync === 'function') {
          const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
          if (sync) {
            const poll = () => {
              if (disposed) {
                gl.deleteSync(sync);
                return;
              }
              const status = gl.clientWaitSync(sync, 0, 0);
              if (status === gl.TIMEOUT_EXPIRED) {
                rafId = requestAnimationFrame(poll);
              } else {
                gl.deleteSync(sync);
                cb();
              }
            };
            rafId = requestAnimationFrame(poll);
            return;
          }
        }
      }
      rafId = requestAnimationFrame(cb);
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = now * 0.001;

      const count = slideRigs.length;
      const currentIdx = activeIndexRef.current;
      const isNarrow = container.clientWidth < 900;
      const stageOffsetX = isNarrow ? 0 : 0.72;
      const baseY = isNarrow ? 0.45 : 0.32;

      for (let i = 0; i < count; i++) {
        const rig = slideRigs[i];
        let diff = i - currentIdx;
        if (diff > count / 2) diff -= count;
        if (diff < -count / 2) diff += count;

        const visualDiff = diff + dragDeltaRef.current;
        const absDiff = Math.abs(visualDiff);
        const angle = visualDiff * 0.46;
        const radius = 5.0;

        const targetX = stageOffsetX + Math.sin(angle) * radius * 0.88;
        const targetZ = Math.cos(angle) * radius - 3.35 - absDiff * 0.45;
        const targetY = baseY - absDiff * 0.08 + Math.sin(elapsed * 1.15 + i * 1.3) * 0.04;
        const targetRotY = -angle * 0.72 + (i === currentIdx ? targetParallaxRef.current.x * 0.07 : 0);
        const targetRotX = i === currentIdx ? -targetParallaxRef.current.y * 0.04 : 0;
        const targetScale = i === currentIdx ? (isNarrow ? 0.94 : 1.06) : Math.max(0.72, 0.88 - absDiff * 0.08);

        const lambda = 7.2;
        rig.group.position.x = THREE.MathUtils.damp(rig.group.position.x, targetX, lambda, dt);
        rig.group.position.y = THREE.MathUtils.damp(rig.group.position.y, targetY, lambda, dt);
        rig.group.position.z = THREE.MathUtils.damp(rig.group.position.z, targetZ, lambda, dt);
        rig.group.rotation.y = THREE.MathUtils.damp(rig.group.rotation.y, targetRotY, lambda, dt);
        rig.group.rotation.x = THREE.MathUtils.damp(rig.group.rotation.x, targetRotX, lambda, dt);

        const s = THREE.MathUtils.damp(rig.group.scale.x, targetScale, lambda, dt);
        rig.group.scale.setScalar(s);

        const targetEmissive = i === currentIdx ? 0.28 : 0.08;
        rig.photoMat.emissiveIntensity = THREE.MathUtils.damp(
          rig.photoMat.emissiveIntensity,
          targetEmissive,
          6,
          dt
        );
        const targetNeon = i === currentIdx ? 1.75 : 0.05;
        rig.neonMat.emissiveIntensity = THREE.MathUtils.damp(
          rig.neonMat.emissiveIntensity,
          targetNeon,
          7,
          dt
        );
      }

      const lookX = isNarrow ? 0 : -0.62;
      TEMP_VEC3.set(
        lookX + targetParallaxRef.current.x * 0.16,
        baseY - 0.12 + targetParallaxRef.current.y * 0.08,
        0.5
      );
      camera.lookAt(TEMP_VEC3);

      activeRenderer.render(scene, camera);
      afterDraw(tick);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('pointermove', onPointerMove);
      domEl.removeEventListener('pointerup', onPointerUp);
      domEl.removeEventListener('pointerleave', onPointerLeave);
      domEl.removeEventListener('webglcontextlost', onContextLost);

      loadedTextures.forEach((t) => t.dispose());
      disposableGeometries.forEach((g) => g.dispose());
      disposableMaterials.forEach((m) => m.dispose());
      envRT.dispose();
      pmremGenerator.dispose();
      activeRenderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, [events, stepSlide]);

  const activeEvent = events[activeIndex] || events[0];
  const isRegistered = registeredIds.includes(activeEvent.id);

  return (
    <section
      aria-label="Interactive 3D Fitness Events Showcase"
      className="relative w-full min-h-[92svh] pt-16 bg-bg overflow-hidden border-b border-white/10 flex flex-col justify-end"
    >
      {/* WebGL 3D Stage Mount */}
      {!webglFallback ? (
        <div
          ref={mountRef}
          className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        />
      ) : (
        <div className="absolute inset-0 z-0 flex items-center justify-center px-6 pt-16 pb-32 bg-gradient-to-b from-[#0E1117] to-bg">
          <div className="relative w-full max-w-4xl flex items-center justify-center gap-4">
            {events.map((ev, idx) => {
              let diff = idx - activeIndex;
              if (diff > events.length / 2) diff -= events.length;
              if (diff < -events.length / 2) diff += events.length;
              const isCenter = diff === 0;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => {
                    setAutoPlay(false);
                    setActiveIndex(idx);
                  }}
                  style={{
                    transform: `translateX(${diff * 58}%) scale(${isCenter ? 1 : 0.78}) rotateY(${diff * -16}deg)`,
                    zIndex: 10 - Math.abs(diff),
                    opacity: Math.abs(diff) > 1 ? 0 : isCenter ? 1 : 0.45,
                  }}
                  className="absolute w-[320px] sm:w-[460px] aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 transition-all duration-500 shadow-2xl"
                >
                  <img
                    src={ev.img}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtle directional vignette for legibility without obscuring the 3D frames */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/45" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2 z-10 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/45 to-transparent" />

      {/* Top Stage Toggle */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 md:px-8 pt-6 flex items-center justify-between pointer-events-none">
        <div className="hud-panel px-3.5 py-1.5 rounded-lg text-[11px] font-mono tracking-wider text-zinc-300 pointer-events-auto">
          3D STAGE · {activeEvent.slideNum} / 0{events.length} · DRAG OR CLICK FRAME
        </div>

        <button
          type="button"
          onClick={() => setFocus3DMode((prev) => !prev)}
          className="hud-panel px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-200 hover:text-neon hover:border-neon/40 transition-colors flex items-center gap-2 pointer-events-auto"
        >
          {focus3DMode ? <Eye className="w-3.5 h-3.5 text-neon" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{focus3DMode ? 'Show Details' : '3D Focus'}</span>
        </button>
      </div>

      {/* Foreground Content + 3D Control Dock */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 md:px-8 pb-8 pt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-auto pointer-events-none">
        {!focus3DMode ? (
          <div className="hud-panel rounded-3xl p-6 md:p-8 max-w-xl pointer-events-auto shadow-2xl">
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-neon mb-2">
              {activeEvent.category} · {activeEvent.schedule} · {activeEvent.venue}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.06] text-white mb-3">
              {activeEvent.title}
            </h1>

            <p className="text-sm text-zinc-300 leading-relaxed mb-5">
              {activeEvent.overview}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-zinc-400 pb-5 mb-5 border-b border-white/10 tabular">
              <span>COACH: <strong className="text-zinc-200">{activeEvent.coach}</strong></span>
              <span>DURATION: <strong className="text-zinc-200">{activeEvent.durationMinutes} MIN</strong></span>
              <span>INTENSITY: <strong className="text-neon">{activeEvent.intensity}</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/ai/workout-generator?event=${activeEvent.id}`}
                className="bg-neon text-bg px-6 py-3 rounded-full text-xs font-bold hover:shadow-neon-glow transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Load Workout Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {onInspectEvent && (
                <button
                  type="button"
                  onClick={() => onInspectEvent(activeEvent)}
                  className="bg-white/[0.06] border border-white/15 hover:border-white/30 text-white px-5 py-3 rounded-full text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-neon" />
                  <span>Inspect Movements</span>
                </button>
              )}

              {onToggleRegister && (
                <button
                  type="button"
                  onClick={() => onToggleRegister(activeEvent.id)}
                  className={cn(
                    'px-4 py-3 rounded-full text-xs font-bold border transition-colors',
                    isRegistered
                      ? 'border-neon/60 bg-neon/15 text-neon'
                      : 'border-white/15 bg-transparent text-zinc-300 hover:text-white'
                  )}
                >
                  {isRegistered ? 'Saved to Hub' : 'RSVP Event'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="hud-panel rounded-2xl px-5 py-3 pointer-events-auto">
            <div className="text-[11px] font-mono text-neon uppercase tracking-widest">
              {activeEvent.slideNum} · {activeEvent.title}
            </div>
          </div>
        )}

        {/* 3D Slideshow Control Dock */}
        <div className="hud-panel rounded-2xl p-2 flex items-center gap-1.5 self-start lg:self-end pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              setAutoPlay(false);
              stepSlide(-1);
            }}
            aria-label="Previous 3D slide"
            className="h-9 w-9 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 px-1">
            {events.map((ev, idx) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => {
                  setAutoPlay(false);
                  setActiveIndex(idx);
                }}
                aria-label={`Select slide ${ev.slideNum}: ${ev.title}`}
                className={cn(
                  'h-9 px-2.5 rounded-xl font-mono text-xs font-bold transition-all tabular',
                  idx === activeIndex
                    ? 'bg-neon text-bg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                )}
              >
                {ev.slideNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setAutoPlay(false);
              stepSlide(1);
            }}
            aria-label="Next 3D slide"
            className="h-9 w-9 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-200 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            type="button"
            onClick={() => setAutoPlay((p) => !p)}
            aria-label={autoPlay ? 'Pause 3D slideshow' : 'Play 3D slideshow'}
            className="h-9 px-3 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5 text-neon" /> : <Play className="w-3.5 h-3.5 text-neon" />}
            <span className="hidden sm:inline">{autoPlay ? 'Auto' : 'Paused'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
