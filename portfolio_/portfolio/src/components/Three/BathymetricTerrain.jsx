import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BathymetricTerrain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
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

    const gridSize = 40;
    const segments = 50;
    const geometry = new THREE.PlaneGeometry(gridSize, gridSize, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position.array;
    const colors = new Float32Array(pos.length);
    for (let i = 0; i < pos.length / 3; i++) {
      const x = pos[i * 3];
      const z = pos[i * 3 + 2];
      const h =
        Math.sin(x * 0.3) * Math.cos(z * 0.4) * 1.5 +
        Math.sin(x * 0.7 + 1.2) * Math.cos(z * 0.5 + 0.8) * 0.8 +
        Math.sin(x * 1.5 + 3.0) * Math.cos(z * 1.2 + 2.1) * 0.4 +
        Math.sin(x * 3.0 + 5.0) * 0.2 +
        Math.cos(z * 2.5 + 4.0) * 0.3;
      const height = h > 0 ? h * 1.5 : h * 0.5;
      pos[i * 3 + 1] = height;

      const t = (height + 3) / 6;
      colors[i * 3] = 0.0 + t * 0.0;
      colors[i * 3 + 1] = 0.2 + t * 0.4;
      colors[i * 3 + 2] = 0.5 + t * 0.3;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      flatShading: false,
      shininess: 10,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    const terrain = new THREE.Mesh(geometry, material);
    scene.add(terrain);

    const wireframeMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.025,
    });
    const wireframe = new THREE.Mesh(geometry.clone(), wireframeMat);
    scene.add(wireframe);

    const ambient = new THREE.AmbientLight(0x4466aa, 0.25);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0x88ccff, 0.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x06b6d4, 0.2);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    camera.position.set(12, 10, 14);
    camera.lookAt(0, 0, 0);

    let angle = 0;
    const anim = () => {
      angle += 0.004;
      terrain.rotation.y = angle * 0.3;
      wireframe.rotation.y = angle * 0.3;
      terrain.position.y = Math.sin(angle * 0.5) * 0.3;
      wireframe.position.y = Math.sin(angle * 0.5) * 0.3;

      camera.position.x = 14 * Math.sin(angle * 0.15);
      camera.position.z = 14 * Math.cos(angle * 0.15);
      camera.lookAt(0, -0.3, 0);

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
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
