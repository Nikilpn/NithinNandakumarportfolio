import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DigitalTwin() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Stars ──
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.3,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Earth globe ──
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 24, 24),
      new THREE.MeshPhongMaterial({
        color: 0x0a1628,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.04,
        transparent: true,
        opacity: 0.35,
      })
    );
    globe.position.set(0, 0, 0);
    scene.add(globe);

    // Globe wireframe
    const wireGlobe = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1.85, 16, 12)),
      new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.12 })
    );
    scene.add(wireGlobe);

    // Latitude circles
    const latMat = new THREE.LineBasicMaterial({ color: 0x0d9488, transparent: true, opacity: 0.1 });
    for (let lat = -60; lat <= 60; lat += 30) {
      const rad = (lat * Math.PI) / 180;
      const r = 1.8 * Math.cos(rad);
      const y = 1.8 * Math.sin(rad);
      const pts = [];
      for (let i = 0; i <= 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
      }
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), latMat);
      scene.add(line);
    }

    // ── Satellites ──
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const satellites = [
      { radius: 3.5, speed: 0.5, tilt: 0.3, phase: 0 },
      { radius: 4.0, speed: -0.4, tilt: -0.5, phase: 2 },
      { radius: 3.0, speed: 0.6, tilt: 0.7, phase: 4 },
      { radius: 4.5, speed: -0.3, tilt: -0.2, phase: 1 },
    ].map((sp) => {
      const sat = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), satMat);
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.2 })
      );
      sat.add(glow);
      const g = new THREE.Group();
      g.add(sat);
      // Orbit path
      const orbitPts = [];
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        orbitPts.push(new THREE.Vector3(sp.radius * Math.cos(a), 0, sp.radius * Math.sin(a)));
      }
      const orbitLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(orbitPts),
        new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.06 })
      );
      orbitLine.rotation.x = sp.tilt;
      const orbitGroup = new THREE.Group();
      orbitGroup.add(orbitLine);
      scene.add(orbitGroup);

      g.position.copy(orbitPts[0]);
      g.rotation.x = sp.tilt;
      scene.add(g);
      return { group: g, orbitGroup, ...sp };
    });

    // ── Lights ──
    const ambient = new THREE.AmbientLight(0x446688, 0.15);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0x88ccff, 0.3);
    light.position.set(5, 10, 7);
    scene.add(light);

    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    // ── Animation ──
    let t = 0;
    const anim = () => {
      t += 0.005;

      globe.rotation.y = t * 0.2;
      wireGlobe.rotation.y = t * 0.2;
      scene.children.forEach((child) => {
        if (child.isLine && child.material.color && child.material.color.getHex() === 0x0d9488) {
          child.rotation.y = t * 0.2;
        }
      });

      satellites.forEach((sp) => {
        const angle = t * sp.speed + sp.phase;
        const x = sp.radius * Math.cos(angle);
        const z = sp.radius * Math.sin(angle);
        sp.group.position.set(x, 0, z);
        // Keep orbiting lines static (already added)
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(anim);
    };
    let animId = requestAnimationFrame(anim);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    };
  }, []);

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
