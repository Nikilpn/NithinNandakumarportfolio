import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PointCloud() {
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
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0x06b6d4,
        size: 0.25,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true,
      })
    );
    scene.add(stars);

    // ── Globe ──
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 24, 24),
      new THREE.MeshPhongMaterial({
        color: 0x0a1628,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.03,
        transparent: true,
        opacity: 0.3,
      })
    );
    scene.add(globe);

    const wireGlobe = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1.55, 16, 12)),
      new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.08 })
    );
    scene.add(wireGlobe);

    // Lat circles
    const latMat = new THREE.LineBasicMaterial({ color: 0x0d9488, transparent: true, opacity: 0.07 });
    for (let lat = -60; lat <= 60; lat += 30) {
      const rad = (lat * Math.PI) / 180;
      const r = 1.5 * Math.cos(rad);
      const y = 1.5 * Math.sin(rad);
      const pts = [];
      for (let i = 0; i <= 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), latMat));
    }

    // ── Satellites ──
    const satData = [
      { radius: 3.2, speed: 0.5, tilt: 0.4, phase: 0, color: 0x06b6d4 },
      { radius: 3.8, speed: -0.35, tilt: -0.6, phase: 2, color: 0x0d9488 },
      { radius: 2.8, speed: 0.6, tilt: 0.8, phase: 4, color: 0x06b6d4 },
      { radius: 4.2, speed: -0.25, tilt: -0.3, phase: 1, color: 0x0d9488 },
      { radius: 3.5, speed: 0.4, tilt: 0.0, phase: 3, color: 0x06b6d4 },
    ];

    const satellites = satData.map((sp) => {
      const sat = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshBasicMaterial({ color: sp.color, transparent: true, opacity: 0.15 })
      );
      sat.add(glow);

      // Orbit ring
      const orbitPts = [];
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        orbitPts.push(new THREE.Vector3(sp.radius * Math.cos(a), 0, sp.radius * Math.sin(a)));
      }
      const orbitLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(orbitPts),
        new THREE.LineBasicMaterial({ color: sp.color, transparent: true, opacity: 0.05 })
      );
      orbitLine.rotation.x = sp.tilt;

      const g = new THREE.Group();
      g.add(sat);
      g.rotation.x = sp.tilt;
      scene.add(orbitLine);
      scene.add(g);
      return { group: g, ...sp };
    });

    // ── Lights ──
    const ambient = new THREE.AmbientLight(0x446688, 0.15);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0x88ccff, 0.3);
    light.position.set(5, 10, 7);
    scene.add(light);

    camera.position.set(0, 1.5, 7);
    camera.lookAt(0, 0, 0);

    // ── Animation ──
    let t = 0;
    const anim = () => {
      t += 0.006;

      globe.rotation.y = t * 0.15;
      wireGlobe.rotation.y = t * 0.15;
      scene.children.forEach((child) => {
        if (child.isLine && child.material.color && child.material.color.getHex() === 0x0d9488) {
          child.rotation.y = t * 0.15;
        }
      });

      satellites.forEach((sp) => {
        const angle = t * sp.speed + sp.phase;
        const x = sp.radius * Math.cos(angle);
        const z = sp.radius * Math.sin(angle);
        sp.group.position.set(x, 0, z);
      });

      // Slow camera orbit
      camera.position.x = 2.5 * Math.sin(t * 0.08);
      camera.position.z = 7 + 1.5 * (Math.cos(t * 0.08) - 1);
      camera.lookAt(0, 0, 0);

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
