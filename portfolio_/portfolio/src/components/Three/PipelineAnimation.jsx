import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PipelineAnimation() {
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

    const stages = [
      { label: "Raw\nSonar\nData", x: -7, color: 0x3b82f6 },
      { label: "QINSy", x: -3.5, color: 0x06b6d4 },
      { label: "Qimera", x: 0, color: 0x0d9488 },
      { label: "CARIS", x: 3.5, color: 0x10b981 },
      { label: "3D\nSeafloor\nMap", x: 7, color: 0x06b6d4 },
    ];

    const nodeGeo = new THREE.BoxGeometry(1.8, 1.2, 0.6);
    stages.forEach((s) => {
      const mesh = new THREE.Mesh(nodeGeo, new THREE.MeshPhongMaterial({
        color: s.color, emissive: s.color, emissiveIntensity: 0.1, transparent: true, opacity: 0.5,
      }));
      mesh.position.set(s.x, 0, 0);
      scene.add(mesh);

      const lines = s.label.split("\n");
      const c = document.createElement("canvas");
      c.width = 256; c.height = 48 * lines.length;
      const ctx = c.getContext("2d");
      ctx.font = "bold 28px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      lines.forEach((line, i) => ctx.fillText(line, c.width / 2, 36 + i * 40));
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: 0.9 }));
      sprite.position.set(s.x, -1.4, 0);
      sprite.scale.set(2.5, 0.8 * lines.length, 1);
      scene.add(sprite);
    });

    // Flow particles
    const pCount = 60;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pProg = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pProg[i] = Math.random();
      const seg = Math.floor(Math.random() * 4);
      const sp = Math.random();
      pPos[i * 3] = stages[seg].x + (stages[seg + 1].x - stages[seg].x) * sp;
      pPos[i * 3 + 1] = Math.sin(sp * Math.PI) * 0.5;
      pPos[i * 3 + 2] = 0;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0x06b6d4, size: 0.15, transparent: true, blending: THREE.AdditiveBlending,
    }));
    scene.add(particles);

    const ambient = new THREE.AmbientLight(0x446688, 0.3);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0x88bbff, 0.5);
    light.position.set(0, 5, 5);
    scene.add(light);

    camera.position.set(0, 0.5, 6);
    camera.lookAt(0, 0, 0);

    let t = 0;
    const anim = () => {
      t += 0.008;
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pProg[i] += 0.003 + Math.random() * 0.005;
        if (pProg[i] > 1) pProg[i] = 0;
        const progress = pProg[i] * 4;
        const segIndex = Math.min(Math.floor(progress), 3);
        const seg = progress - segIndex;
        pos[i * 3] = stages[segIndex].x + (stages[segIndex + 1].x - stages[segIndex].x) * seg;
        pos[i * 3 + 1] = Math.sin(seg * Math.PI) * 0.4;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      scene.children.forEach((child) => {
        if (child.isMesh && child.geometry === nodeGeo) {
          const scale = 1 + Math.sin(t * 2) * 0.05;
          child.scale.set(scale, scale, scale);
        }
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
