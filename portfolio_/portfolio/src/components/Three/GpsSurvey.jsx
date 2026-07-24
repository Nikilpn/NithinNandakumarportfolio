import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GpsSurvey() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    // Earth
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0x0a1628, emissive: 0x06b6d4, emissiveIntensity: 0.15, transparent: true, opacity: 0.6 })
    );
    scene.add(earth);

    const gridLines = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(2.55, 16, 12)),
      new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.2 })
    );
    scene.add(gridLines);

    // Satellites
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const satellites = [
      { radius: 4.5, speed: 0.5, tilt: 0.3, phase: 0 },
      { radius: 4.8, speed: -0.4, tilt: -0.5, phase: 2 },
      { radius: 4.2, speed: 0.6, tilt: 0.7, phase: 4 },
      { radius: 5.0, speed: -0.3, tilt: -0.2, phase: 1 },
    ].map((sp) => {
      const sat = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), satMat);
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 })
      );
      sat.add(glow);
      scene.add(sat);
      return { mesh: sat, ...sp };
    });

    // Signal rings
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.1, 0.15, 24),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0, side: THREE.DoubleSide })
      );
      scene.add(ring);
      rings.push(ring);
    }

    // Ground station
    const markerGroup = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), new THREE.MeshBasicMaterial({ color: 0x0d9488 }));
    pole.position.y = 0.6;
    markerGroup.add(pole);
    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    dish.position.y = 1.3;
    dish.rotation.x = 0.3;
    markerGroup.add(dish);
    markerGroup.position.set(0, -2.5, 2);
    scene.add(markerGroup);

    // Coordinate labels
    [{ text: "53.55°N 10.00°E", pos: new THREE.Vector3(-2.5, 2.5, 0) }].forEach(({ text, pos }) => {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 64;
      const ctx = c.getContext("2d");
      ctx.font = "bold 28px monospace";
      ctx.fillStyle = "#06b6d4";
      ctx.fillText(text, 10, 42);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: 0.7 }));
      sprite.position.copy(pos);
      sprite.scale.set(2, 0.5, 1);
      scene.add(sprite);
    });

    const ambient = new THREE.AmbientLight(0x224466, 0.4);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0x88ccff, 0.8);
    sun.position.set(10, 15, 5);
    scene.add(sun);

    camera.position.set(0, 0, 9);
    camera.lookAt(0, 0, 0);

    let t = 0;
    const anim = () => {
      t += 0.01;
      earth.rotation.y += 0.005;
      gridLines.rotation.y += 0.005;

      satellites.forEach((sat) => {
        const angle = t * sat.speed + sat.phase;
        sat.mesh.position.set(
          sat.radius * Math.cos(angle),
          Math.sin(angle * 1.5) * sat.tilt * 1.5,
          sat.radius * Math.sin(angle)
        );
        sat.mesh.lookAt(0, 0, 0);
      });

      rings.forEach((ring, i) => {
        const pulse = t * 1.5 + i * 1.2;
        const size = (pulse % 6) * 0.3 + 0.1;
        ring.geometry.dispose();
        ring.geometry = new THREE.RingGeometry(size, size + 0.08, 24);
        ring.position.copy(markerGroup.position);
        ring.material.opacity = Math.max(0, 0.5 - (pulse % 6) / 12);
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(anim);
    };
    let animId = requestAnimationFrame(anim);

    const resize = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="three-container" />;
}
