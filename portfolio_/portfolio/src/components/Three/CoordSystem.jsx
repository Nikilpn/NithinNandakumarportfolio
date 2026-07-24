import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CoordSystem() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const makeArrow = (dir, color, label) => {
      const g = new THREE.Group();
      g.add(new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), 3.5, color, 0.3, 0.15));
      const c = document.createElement("canvas");
      c.width = 128; c.height = 64;
      const ctx = c.getContext("2d");
      ctx.font = "bold 36px monospace";
      ctx.fillStyle = "#" + color.toString(16).padStart(6, "0");
      ctx.fillText(label, 20, 46);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true }));
      sprite.position.copy(dir.clone().multiplyScalar(4.1));
      sprite.scale.set(0.8, 0.4, 1);
      g.add(sprite);
      return g;
    };

    scene.add(makeArrow(new THREE.Vector3(1, 0, 0), 0xff4444, "X"));
    scene.add(makeArrow(new THREE.Vector3(0, 1, 0), 0x44ff44, "Y"));
    scene.add(makeArrow(new THREE.Vector3(0, 0, 1), 0x4488ff, "Z"));

    // Globe
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 24, 24),
      new THREE.MeshPhongMaterial({ color: 0x0a1628, emissive: 0x06b6d4, emissiveIntensity: 0.08, transparent: true, opacity: 0.3 })
    );
    scene.add(globe);

    const wireSphere = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1.84, 16, 12)),
      new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.15 })
    );
    scene.add(wireSphere);

    // Lat circles
    const latMat = new THREE.LineBasicMaterial({ color: 0x0d9488, transparent: true, opacity: 0.2 });
    for (let lat = -60; lat <= 60; lat += 30) {
      const rad = (lat * Math.PI) / 180;
      const r = 1.8 * Math.cos(rad);
      const y = 1.8 * Math.sin(rad);
      const pts = [];
      for (let i = 0; i <= 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), latMat));
    }

    // Lon lines
    const lonMat = new THREE.LineBasicMaterial({ color: 0x0d9488, transparent: true, opacity: 0.2 });
    for (let lon = 0; lon < 360; lon += 30) {
      const rad = (lon * Math.PI) / 180;
      const pts = [];
      for (let i = 0; i <= 36; i++) {
        const a = (i / 36) * Math.PI;
        pts.push(new THREE.Vector3(
          1.8 * Math.sin(a) * Math.cos(rad),
          1.8 * Math.cos(a),
          1.8 * Math.sin(a) * Math.sin(rad)
        ));
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lonMat));
    }

    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    scene.add(dot);

    const trailMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.3 });
    const trailLine = new THREE.Line(new THREE.BufferGeometry(), trailMat);
    scene.add(trailLine);

    const ambient = new THREE.AmbientLight(0x446688, 0.3);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0x88bbff, 0.6);
    light.position.set(5, 10, 7);
    scene.add(light);

    camera.position.set(5, 4, 6);
    camera.lookAt(0, 0, 0);

    let t = 0;
    const trailPoints = [];
    const anim = () => {
      t += 0.008;
      globe.rotation.y = t * 0.3;
      wireSphere.rotation.y = t * 0.3;

      scene.children.forEach((child) => {
        if (child.isLine && child.material.color && child.material.color.getHex() === 0x0d9488) child.rotation.y = t * 0.3;
      });

      const dotLon = t * 0.5;
      const dotLat = Math.sin(t * 0.4) * 0.6;
      const dr = 1.8 * 1.05;
      dot.position.set(dr * Math.cos(dotLat) * Math.cos(dotLon), dr * Math.sin(dotLat), dr * Math.cos(dotLat) * Math.sin(dotLon));

      trailPoints.push(dot.position.clone());
      if (trailPoints.length > 40) trailPoints.shift();
      trailLine.geometry.dispose();
      trailLine.geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), ...trailPoints]);

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
