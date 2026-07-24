import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DigitalTwin() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
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

    // Terrain / coastline
    const terrainGeo = new THREE.PlaneGeometry(20, 14, 40, 30);
    terrainGeo.rotateX(-Math.PI / 2);
    const tPos = terrainGeo.attributes.position.array;
    for (let i = 0; i < tPos.length / 3; i++) {
      const x = tPos[i * 3];
      const z = tPos[i * 3 + 2];
      let height = 0;
      if (z < -2 + Math.sin(x * 0.5) * 1.5) {
        height = Math.sin(x * 0.4) * Math.cos(z * 0.3) * 0.8 + Math.sin(x * 1.2 + 2) * 0.3 + 0.2;
      } else if (z < -1 + Math.sin(x * 0.5) * 1.5) {
        height = ((z + 2 - Math.sin(x * 0.5) * 1.5) / 1) * -0.2;
      } else {
        height = -0.5 + Math.sin(x * 0.6) * Math.cos(z * 0.4) * 0.2;
      }
      tPos[i * 3 + 1] = height;
    }
    terrainGeo.computeVertexNormals();

    const terrain = new THREE.Mesh(terrainGeo, new THREE.MeshPhongMaterial({
      color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.08, flatShading: true, transparent: true, opacity: 0.25, side: THREE.DoubleSide,
    }));
    scene.add(terrain);

    const buildingMat = new THREE.MeshPhongMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.05, transparent: true, opacity: 0.3 });
    [[-6, -3], [-4, -4.5], [-3, -2.5], [-5, -1.5], [-7, -4], [-2, -3.5], [-8, -2]].forEach(([bx, bz]) => {
      const bw = 0.3 + Math.random() * 0.4;
      const bh = 0.3 + Math.random() * 0.8;
      const bd = 0.3 + Math.random() * 0.4;
      const building = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), buildingMat);
      building.position.set(bx, bh / 2, bz);
      scene.add(building);
    });

    const ocean = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 14, 30, 20).rotateX(-Math.PI / 2),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    );
    ocean.position.y = 0.05;
    scene.add(ocean);

    const surveyMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const surveyPoints = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI;
      const sx = -2 + Math.sin(angle * 1.5) * 4;
      const sz = -2 + Math.cos(angle * 0.8) * 3;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), surveyMat);
      dot.position.set(sx, 0.1, sz);
      scene.add(dot);
      surveyPoints.push(dot);
      const glow = new THREE.Mesh(
        new THREE.RingGeometry(0.12, 0.18, 16),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
      );
      glow.position.copy(dot.position);
      glow.rotation.x = -Math.PI / 2;
      scene.add(glow);
      surveyPoints.push(glow);
    }

    const ambient = new THREE.AmbientLight(0x88ccff, 0.4);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0x88ccff, 0.8);
    dirLight.position.set(8, 15, 5);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x06b6d4, 0.3);
    fillLight.position.set(-5, 5, -8);
    scene.add(fillLight);

    camera.position.set(5, 8, 12);
    camera.lookAt(-2, 0, 0);

    let t = 0;
    const anim = () => {
      t += 0.004;
      const radius = 13;
      camera.position.set(
        -2 + radius * Math.sin(t * 0.15) * 0.4,
        6 + Math.sin(t * 0.25) * 0.8,
        radius * Math.cos(t * 0.15)
      );
      camera.lookAt(-2, -0.2, 0);

      const oPos = ocean.geometry.attributes.position.array;
      for (let i = 0; i < oPos.length / 3; i++) {
        oPos[i * 3 + 1] = Math.sin(oPos[i * 3] * 0.5 + t * 1.2) * 0.04 + Math.cos(oPos[i * 3 + 2] * 0.4 + t) * 0.03;
      }
      ocean.geometry.attributes.position.needsUpdate = true;

      surveyPoints.forEach((sp, i) => {
        if (i % 2 === 0) {
          const scale = 1 + Math.sin(t * 1.5 + i) * 0.2;
          sp.scale.set(scale, scale, scale);
        }
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
