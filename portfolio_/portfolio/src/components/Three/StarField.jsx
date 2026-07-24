import { useEffect, useRef } from "react";
import * as THREE from "three";

const STAR_COUNT = 3000;

export default function StarField({ mouseInfluence = true }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = Math.max(w, h) * 0.6;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const speeds = new Float32Array(STAR_COUNT);
    const origPositions = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      const spread = Math.max(canvas.clientWidth, canvas.clientHeight) * 1.2;
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread * 0.5;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      origPositions[i * 3] = x;
      origPositions[i * 3 + 1] = y;
      origPositions[i * 3 + 2] = z;
      sizes[i] = 0.5 + Math.random() * 2.5;
      speeds[i] = 0.2 + Math.random() * 0.6;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#06b6d4"),
      size: 3.5,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    const time = { t: 0 };

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    if (mouseInfluence) window.addEventListener("mousemove", handleMouse);

    let animId;
    const anim = () => {
      time.t += 0.005;
      const pos = stars.geometry.attributes.position.array;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;
        const ox = origPositions[i3];
        const oy = origPositions[i3 + 1];
        const oz = origPositions[i3 + 2];
        const twinkle = Math.sin(time.t * speeds[i] + i) * 6;

        let dx = 0, dy = 0;
        if (mouseInfluence) {
          const px = ox / Math.max(canvas.clientWidth, canvas.clientHeight);
          const py = oy / Math.max(canvas.clientWidth, canvas.clientHeight);
          const dist = Math.sqrt((px - mx) ** 2 + (py - my) ** 2);
          if (dist < 0.5) {
            const force = (1 - dist / 0.5) * 15;
            dx = (ox - mx * Math.max(canvas.clientWidth, canvas.clientHeight)) * 0.01 * force;
            dy = (oy - my * Math.max(canvas.clientWidth, canvas.clientHeight)) * 0.01 * force;
          }
        }

        pos[i3] = ox + dx + Math.sin(time.t * 0.3 + i * 0.01) * twinkle * 0.3;
        pos[i3 + 1] = oy + dy + Math.cos(time.t * 0.3 + i * 0.01) * twinkle * 0.3;
        pos[i3 + 2] = oz + twinkle * 0.2;
      }
      stars.geometry.attributes.position.needsUpdate = true;
      stars.rotation.z += 0.0002;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(anim);
    };
    anim();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (mouseInfluence) window.removeEventListener("mousemove", handleMouse);
      renderer.dispose();
    };
  }, [mouseInfluence]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}
