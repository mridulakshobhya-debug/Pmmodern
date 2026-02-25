"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 1700;

interface ParticleMeta {
  x: number;
  y: number;
  z: number;
  velocity: number;
  rotation: number;
}

export function RiceParticleHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        62,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 12);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xf4f5de, 0.75);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xb5ffd8, 1.8, 45);
      pointLight.position.set(2, 6, 10);
      scene.add(pointLight);

      const grainGeometry = new THREE.SphereGeometry(0.06, 6, 6);
      const grainMaterial = new THREE.MeshStandardMaterial({
        color: 0xf4f2dd,
        roughness: 0.35,
        metalness: 0.2
      });
      const mesh = new THREE.InstancedMesh(grainGeometry, grainMaterial, PARTICLE_COUNT);
      scene.add(mesh);

      const metas: ParticleMeta[] = [];
      const dummy = new THREE.Object3D();
      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const meta: ParticleMeta = {
          x: THREE.MathUtils.randFloatSpread(20),
          y: THREE.MathUtils.randFloatSpread(12),
          z: THREE.MathUtils.randFloatSpread(14),
          velocity: THREE.MathUtils.randFloat(0.002, 0.008),
          rotation: Math.random() * Math.PI
        };
        metas.push(meta);

        dummy.position.set(meta.x, meta.y, meta.z);
        dummy.rotation.set(meta.rotation, meta.rotation * 0.65, meta.rotation * 0.35);
        dummy.scale.set(0.6, 1.7, 0.6);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;

      let mouseX = 0;
      let mouseY = 0;

      const onMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 1.2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 0.6;
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      const clock = new THREE.Clock();
      let animationFrameId = 0;

      const render = () => {
        const elapsed = clock.getElapsedTime();
        camera.position.x += (mouseX - camera.position.x) * 0.025;
        camera.position.y += (-mouseY - camera.position.y) * 0.025;

        for (let i = 0; i < PARTICLE_COUNT; i += 1) {
          const meta = metas[i];
          meta.y += meta.velocity;
          if (meta.y > 8) {
            meta.y = -8;
          }

          dummy.position.set(meta.x + Math.sin(elapsed + i * 0.03) * 0.08, meta.y, meta.z);
          dummy.rotation.set(meta.rotation + elapsed * 0.12, meta.rotation * 0.5, elapsed * 0.1);
          dummy.scale.set(0.6, 1.7, 0.6);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;
        renderer.render(scene, camera);
        animationFrameId = window.requestAnimationFrame(render);
      };
      render();

      const onResize = () => {
        if (!containerRef.current) return;
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        window.cancelAnimationFrame(animationFrameId);
        renderer.dispose();
        grainGeometry.dispose();
        grainMaterial.dispose();
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch {
      return undefined;
    }
  }, []);

  return <div ref={containerRef} className="absolute inset-0" aria-hidden />;
}
