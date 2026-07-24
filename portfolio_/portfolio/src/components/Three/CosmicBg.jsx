import { useEffect, useRef } from "react";
import * as THREE from "three";

const STAR_COUNT = 3000;

export default function CosmicBg({ mouseInfluence = true }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    // ── Resize ──
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Stars (fewer + smaller + dimmer on mobile) ──
    const starCount = isMobile ? 800 : STAR_COUNT;
    const starSize = isMobile ? 1.8 : 3.5;
    const starOpacity = isMobile ? 0.6 : 1;
    const twinkleStrength = isMobile ? 3 : 6;

    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starSpeeds = new Float32Array(starCount);
    const starOrig = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const spread = 800;
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread * 0.5 - 100;
      starPos[i * 3] = x;
      starPos[i * 3 + 1] = y;
      starPos[i * 3 + 2] = z;
      starOrig[i * 3] = x;
      starOrig[i * 3 + 1] = y;
      starOrig[i * 3 + 2] = z;
      starSizes[i] = 0.5 + Math.random() * 2.5;
      starSpeeds[i] = 0.2 + Math.random() * 0.6;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.PointsMaterial({
      color: new THREE.Color("#06b6d4"),
      size: starSize,
      transparent: true,
      opacity: starOpacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Earth Globe ──
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 32, 32),
      new THREE.MeshPhongMaterial({
        color: 0x0a1628,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.5,
      })
    );
    earth.position.set(-6, 0, -8);
    scene.add(earth);

    const wireGlobe = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(2.25, 16, 12)),
      new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.15 })
    );
    wireGlobe.position.copy(earth.position);
    scene.add(wireGlobe);

    // Lat circles
    const latMat = new THREE.LineBasicMaterial({ color: 0x0d9488, transparent: true, opacity: 0.15 });
    for (let lat = -60; lat <= 60; lat += 30) {
      const rad = (lat * Math.PI) / 180;
      const r = 2.2 * Math.cos(rad);
      const y = 2.2 * Math.sin(rad);
      const pts = [];
      for (let i = 0; i <= 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
      }
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), latMat);
      line.position.copy(earth.position);
      scene.add(line);
    }

    // ── Satellites ──
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const satellites = [
      { radius: 3.8, speed: 0.5, tilt: 0.3, phase: 0 },
      { radius: 4.2, speed: -0.4, tilt: -0.5, phase: 2 },
      { radius: 3.5, speed: 0.6, tilt: 0.7, phase: 4 },
      { radius: 4.5, speed: -0.3, tilt: -0.2, phase: 1 },
    ].map((sp) => {
      const sat = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), satMat);
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 })
      );
      sat.add(glow);
      const g = new THREE.Group();
      g.position.copy(earth.position);
      g.add(sat);
      scene.add(g);
      return { mesh: sat, group: g, ...sp };
    });

    // ── Floating Particles (less on mobile) ──
    const pCount = isMobile ? 120 : 500;
    const pSize = isMobile ? 0.04 : 0.08;
    const pOpacity = isMobile ? 0.2 : 0.4;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pPhases = new Float32Array(pCount);
    const pSpeeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 6;
      pPos[i * 3] = earth.position.x + Math.cos(angle) * radius;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pPos[i * 3 + 2] = earth.position.z + Math.sin(angle) * radius;
      pPhases[i] = Math.random() * Math.PI * 2;
      pSpeeds[i] = 0.2 + Math.random() * 0.5;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: pSize,
      transparent: true,
      opacity: pOpacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── GPS Signal Ring ──
    const ringGeo = new THREE.RingGeometry(0.3, 0.4, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const signalRing = new THREE.Mesh(ringGeo, ringMat);
    signalRing.position.set(-6, -2.2, -6);
    signalRing.rotation.x = -Math.PI / 2;
    scene.add(signalRing);

    // ── Lights ──
    const ambient = new THREE.AmbientLight(0x446688, 0.3);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0x88bbff, 0.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // ── Camera ──
    camera.position.set(0, 2, 14);
    camera.lookAt(0, 0, 0);

    // ── Mouse ──
    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    if (mouseInfluence) window.addEventListener("mousemove", handleMouse);

    // ── Animation ──
    let animId;
    const time = { t: 0 };
    const anim = () => {
      time.t += 0.005;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Stars twinkle
      const sPos = stars.geometry.attributes.position.array;
      for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;
        const ox = starOrig[i3];
        const oy = starOrig[i3 + 1];
        const oz = starOrig[i3 + 2];
        const twinkle = Math.sin(time.t * starSpeeds[i] + i) * twinkleStrength;

        let dx = 0, dy = 0;
        if (mouseInfluence) {
          const px = ox / 800;
          const py = oy / 800;
          const dist = Math.sqrt((px - mx) ** 2 + (py - my) ** 2);
          if (dist < 0.5) {
            const force = (1 - dist / 0.5) * 15;
            dx = (ox - mx * 800) * 0.01 * force;
            dy = (oy - my * 800) * 0.01 * force;
          }
        }

        sPos[i3] = ox + dx + Math.sin(time.t * 0.3 + i * 0.01) * twinkle * 0.3;
        sPos[i3 + 1] = oy + dy + Math.cos(time.t * 0.3 + i * 0.01) * twinkle * 0.3;
        sPos[i3 + 2] = oz + twinkle * 0.2;
      }
      stars.geometry.attributes.position.needsUpdate = true;
      stars.rotation.z += 0.0002;

      // Rotate globe
      earth.rotation.y += 0.003;
      wireGlobe.rotation.y += 0.003;

      // Satellites orbit
      satellites.forEach((sat) => {
        const angle = time.t * sat.speed + sat.phase;
        sat.mesh.position.set(
          sat.radius * Math.cos(angle),
          Math.sin(angle * 1.5) * sat.tilt * 1.5,
          sat.radius * Math.sin(angle)
        );
        sat.mesh.lookAt(earth.position);
      });

      // Signal ring pulse
      const pulse = time.t * 1.5;
      const size = (pulse % 6) * 0.3 + 0.1;
      signalRing.geometry.dispose();
      signalRing.geometry = new THREE.RingGeometry(size, size + 0.08, 32);
      signalRing.material.opacity = Math.max(0, 0.4 - (pulse % 6) / 12);

      // Particles drift
      const pPosArr = particles.geometry.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pPosArr[i * 3 + 1] += Math.sin(time.t * pSpeeds[i] + pPhases[i]) * 0.002;
      }
      particles.geometry.attributes.position.needsUpdate = true;

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
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: -1,
      }}
    />
  );
}
