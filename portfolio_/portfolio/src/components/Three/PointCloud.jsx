import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PointCloud() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.set(3, 2, 4);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const pointCount = 5000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    const sizes = new Float32Array(pointCount);
    const phases = new Float32Array(pointCount);

    for (let i = 0; i < pointCount; i++) {
      let x, y, z;
      if (i < 2500) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const rx = 2.5, ry = 0.8, rz = 1.0;
        x = rx * Math.sin(v) * Math.cos(u);
        y = ry * Math.cos(v) + 0.2;
        z = rz * Math.sin(v) * Math.sin(u);
        if (y < 0) y *= 0.3;
      } else if (i < 3800) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.5 + Math.random() * 3;
        x = Math.cos(angle) * dist;
        z = Math.sin(angle) * dist * 0.6;
        y = -0.2 + Math.random() * 0.4;
      } else {
        x = (Math.random() - 0.5) * 8;
        z = (Math.random() - 0.5) * 5;
        y = -0.8 + Math.random() * 0.3;
      }
      x += (Math.random() - 0.5) * 0.06;
      y += (Math.random() - 0.5) * 0.06;
      z += (Math.random() - 0.5) * 0.06;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      const c = 0.3 + (y + 0.8) / 2.5;
      colors[i * 3] = 0.0 + c * 0.1;
      colors[i * 3 + 1] = 0.5 + c * 0.3;
      colors[i * 3 + 2] = 0.6 + c * 0.2;

      sizes[i] = 0.04 + Math.random() * 0.12;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Glow texture
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const gctx = glowCanvas.getContext("2d");
    const grad = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.05, "rgba(180,240,255,1)");
    grad.addColorStop(0.15, "rgba(6,182,212,0.9)");
    grad.addColorStop(0.5, "rgba(6,182,212,0.4)");
    grad.addColorStop(1, "rgba(6,182,212,0)");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 64, 64);
    const glowTex = new THREE.CanvasTexture(glowCanvas);

    const mat = new THREE.PointsMaterial({
      size: 0.2,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const cloud = new THREE.Points(geo, mat);
    scene.add(cloud);

    // Sonar sweep ring
    const ringMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.12 });
    const ringPoints = [];
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0));
    }
    const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPoints), ringMat);
    const sweepGroup = new THREE.Group();
    sweepGroup.add(ring);
    scene.add(sweepGroup);

    // Background ambient points
    const bgCount = 800;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      bgPos[i * 3] = (Math.random() - 0.5) * 20;
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
    const bgCloud = new THREE.Points(bgGeo, new THREE.PointsMaterial({
      color: 0x06b6d4, size: 0.05, transparent: true, opacity: 0.4,
      map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }));
    scene.add(bgCloud);

    const ambient = new THREE.AmbientLight(0x446688, 0.3);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0x88bbff, 0.5);
    light.position.set(3, 5, 4);
    scene.add(light);

    camera.position.set(3, 2, 4);
    camera.lookAt(0, 0, 0);

    let t = 0;
    const anim = () => {
      t += 0.005;
      cloud.rotation.y += 0.0015;
      cloud.rotation.x = Math.sin(t * 0.12) * 0.03;
      bgCloud.rotation.y += 0.0003;

      // Strong shining — pulse each vertex individually with random sparkle
      const col = cloud.geometry.attributes.color.array;
      for (let i = 0; i < pointCount; i++) {
        const sparkle = Math.sin(t * 3.5 + phases[i] * 2) * 0.5 + 0.5;
        const shine = 0.5 + sparkle * 0.5;
        const ci = i * 3;
        const c = 0.3 + (pos[ci + 1] + 0.8) / 2.5;
        col[ci] = (0.0 + c * 0.1) * shine;
        col[ci + 1] = (0.5 + c * 0.3) * shine;
        col[ci + 2] = (0.6 + c * 0.2) * shine;
      }
      cloud.geometry.attributes.color.needsUpdate = true;

      // Pulse overall size/opacity
      mat.size = 0.15 + Math.sin(t * 2.0) * 0.06;
      mat.opacity = 0.85 + Math.sin(t * 1.8) * 0.12;

      sweepGroup.position.x = Math.sin(t * 0.6) * 0.8;
      sweepGroup.position.y = Math.cos(t * 0.4) * 0.3;
      sweepGroup.position.z = Math.cos(t * 0.5) * 0.8;
      const sweepScale = 1 + Math.sin(t * 1.3) * 0.4;
      ring.scale.set(sweepScale, sweepScale, sweepScale);
      ring.material.opacity = 0.08 + Math.sin(t * 1.3) * 0.06;

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
