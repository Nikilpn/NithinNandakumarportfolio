import { useEffect, useRef, useState } from "react";
import "./InteractiveShipCanvas.css";

function InteractiveShipCanvas() {
    const canvasRef = useRef(null);
    const [telemetry, setTelemetry] = useState({
        lat: "09°55'56.7\" N",
        lon: "76°16'02.3\" E",
        depth: "42.8",
        sonarFreq: "120",
        speed: "4.2",
        scanProgress: 0,
    });

    const mouseRef = useRef({ x: 0, y: 0, active: false, px: 0, py: 0 });
    const pingsRef = useRef([]);

    // Handle mouse moves for geospatial tracking HUD
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mouseRef.current.x = x;
        mouseRef.current.y = y;
        mouseRef.current.active = true;

        // Convert mouse position to realistic simulated marine coordinates
        const baseLatNum = 9.9324;
        const baseLonNum = 76.2673;
        const computedLat = baseLatNum + (y - rect.height / 2) * 0.00002;
        const computedLon = baseLonNum + (x - rect.width / 2) * 0.00002;

        const latDeg = Math.floor(computedLat);
        const latMin = Math.floor((computedLat - latDeg) * 60);
        const latSec = (((computedLat - latDeg) * 60 - latMin) * 60).toFixed(1);

        const lonDeg = Math.floor(computedLon);
        const lonMin = Math.floor((computedLon - lonDeg) * 60);
        const lonSec = (((computedLon - lonDeg) * 60 - lonMin) * 60).toFixed(1);

        const simulatedDepth = Math.max(
            15.0,
            (40 + Math.sin(x * 0.01) * 15 + Math.cos(y * 0.01) * 8 + (y / rect.height) * 30).toFixed(1)
        );

        setTelemetry((prev) => ({
            ...prev,
            lat: `${latDeg.toString().padStart(2, "0")}°${latMin.toString().padStart(2, "0")}'${latSec.padStart(4, "0")}" N`,
            lon: `${lonDeg.toString().padStart(2, "0")}°${lonMin.toString().padStart(2, "0")}'${lonSec.padStart(4, "0")}" E`,
            depth: simulatedDepth,
            speed: (3.8 + Math.sin(Date.now() * 0.001) * 0.5).toFixed(1),
        }));
    };

    const handleMouseLeave = () => {
        mouseRef.current.active = false;
    };

    const handleClick = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Trigger a sonar ping animation in the array
        pingsRef.current.push({
            x,
            y,
            radius: 0,
            maxRadius: Math.max(rect.width, rect.height) * 0.7,
            alpha: 1.0,
            speed: 4,
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let time = 0;

        // Configuration / Theme Variables
        const colorCyan = "#06b6d4";
        const colorTeal = "#0d9488";
        const colorBlue = "#3b82f6";

        // Set high-DPI scaling
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            const width = parent.clientWidth || 500;
            const height = parent.clientHeight || 500;
            const dpr = window.devicePixelRatio || 1;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            ctx.scale(dpr, dpr);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // 3D Projection parameters for Ship & Seabed Grid
        // Let's define the 3D ship vertices
        const shipVertices = [
            // Hull Base Center
            { x: -50, y: 0, z: 0 },   // Stern bottom [0]
            { x: 40, y: 0, z: 0 },    // Bow bottom [1]
            // Hull Deck Port
            { x: -60, y: -12, z: -12 }, // Port Stern [2]
            { x: 30, y: -12, z: -12 },  // Port Mid-Bow [3]
            { x: 55, y: -12, z: 0 },    // Port Bow tip [4]
            // Hull Deck Starboard
            { x: -60, y: -12, z: 12 },  // Starboard Stern [5]
            { x: 30, y: -12, z: 12 },   // Starboard Mid-Bow [6]
            { x: 55, y: -12, z: 0 },    // Starboard Bow tip [7]
            // Deck House Upper Cabin
            { x: -20, y: -25, z: -8 },  // Back Port Cabin [8]
            { x: 10, y: -25, z: -8 },   // Front Port Cabin [9]
            { x: -20, y: -25, z: 8 },   // Back Starboard Cabin [10]
            { x: 10, y: -25, z: 8 },    // Front Starboard Cabin [11]
            // Mast / A-frame on Stern
            { x: -45, y: -30, z: 0 },   // Mast tip [12]
        ];

        // Connect vertices to draw structural panels/lines
        const shipLines = [
            [0, 1], [0, 2], [0, 5], [1, 4], [1, 7], // keel lines
            [2, 3], [3, 4], [5, 6], [6, 7], // deck edges
            [2, 5], [3, 6], // transoms
            [8, 9], [9, 11], [11, 10], [10, 8], // Cabin roof
            [2, 8], [3, 9], [5, 10], [6, 11], // Cabin pillars
            [0, 12], [2, 12], [5, 12] // Stern Mast/A-frame
        ];

        // Project 3D coordinate to 2D isometric viewport
        const project3D = (pt, shipRotation, waveOffset, centerX, centerY) => {
            const { yaw, pitch, roll } = shipRotation;

            // Apply Roll (rotation around X)
            let x1 = pt.x;
            let y1 = pt.y * Math.cos(roll) - pt.z * Math.sin(roll);
            let z1 = pt.y * Math.sin(roll) + pt.z * Math.cos(roll);

            // Apply Pitch (rotation around Z)
            let x2 = x1 * Math.cos(pitch) - y1 * Math.sin(pitch);
            let y2 = x1 * Math.sin(pitch) + y1 * Math.cos(pitch);
            let z2 = z1;

            // Apply Yaw (rotation around Y)
            let x3 = x2 * Math.cos(yaw) - z2 * Math.sin(yaw);
            let y3 = y2;
            let z3 = x2 * Math.sin(yaw) + z2 * Math.cos(yaw);

            // Perspective Projection
            const zoom = 1.3;
            const projX = centerX + x3 * zoom - z3 * 0.4;
            const projY = centerY + y3 * zoom + waveOffset;

            return { x: projX, y: projY };
        };

        // AI constellation points floating in the background
        const aiParticles = [];
        for (let i = 0; i < 12; i++) {
            aiParticles.push({
                x: Math.random(),
                y: Math.random() * 0.35 + 0.05, // sky range
                vx: (Math.random() - 0.5) * 0.0006,
                vy: (Math.random() - 0.5) * 0.0003,
                size: Math.random() * 2 + 1,
            });
        }

        // Main render loop
        const render = () => {
            if (!canvas) return;
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);

            ctx.clearRect(0, 0, w, h);
            time += 0.015;

            // Set telemetry scan progress
            setTelemetry((prev) => ({
                ...prev,
                scanProgress: ((time * 12) % 100).toFixed(0),
            }));

            // ==========================================
            // 1. DRAW BACKGROUND & SCANNERS
            // ==========================================
            // Subtle background grid represent spatial mapping coordinate space
            ctx.strokeStyle = "rgba(6, 182, 212, 0.025)";
            ctx.lineWidth = 1;
            const spacing = 80;
            for (let x = 0; x < w; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // ==========================================
            // 2. DRAW AI FLOATING CONSTELLATION IN SKY
            // ==========================================
            aiParticles.forEach((p, idx) => {
                // Move particles
                p.x += p.vx;
                p.y += p.vy;

                // Wrap boundaries
                if (p.x < 0) p.x = 1;
                if (p.x > 1) p.x = 0;
                if (p.y < 0) p.y = 0.45;
                if (p.y > 0.45) p.y = 0;

                const px = p.x * w;
                const py = p.y * h;

                ctx.fillStyle = `rgba(6, 182, 212, ${0.15 + 0.1 * Math.sin(time + idx)})`;
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Connect particles within proximity
                for (let j = idx + 1; j < aiParticles.length; j++) {
                    const p2 = aiParticles[j];
                    const dx = px - p2.x * w;
                    const dy = py - p2.y * h;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 60) {
                        ctx.strokeStyle = `rgba(13, 148, 136, ${0.08 * (1 - dist / 60)})`;
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(p2.x * w, p2.y * h);
                        ctx.stroke();
                    }
                }

                // Connect to mouse for interaction
                if (mouseRef.current.active && py < h * 0.45) {
                    const mDistX = px - mouseRef.current.x;
                    const mDistY = py - mouseRef.current.y;
                    const mDist = Math.sqrt(mDistX * mDistX + mDistY * mDistY);
                    if (mDist < 120) {
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * (1 - mDist / 120)})`;
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                        ctx.stroke();
                    }
                }
            });

            // ==========================================
            // 3. DRAW OCEAN WAVES & BOAT PHYSICS
            // ==========================================
            const waveCenterY = h * 0.48;
            const waveAmplitude = 10;
            const waveFreq = 0.008;

            // Calculate ship coordinates & rocking angles based on wave
            const shipBaseX = w * 0.45;
            const waveOffset = Math.sin(time * 2 + shipBaseX * waveFreq) * waveAmplitude;
            const shipWaveSlope = Math.cos(time * 2 + shipBaseX * waveFreq) * waveAmplitude * waveFreq;

            // Rocking calculations
            // Pitch goes with the wave slope
            const pitch = shipWaveSlope * 0.8;
            // Gently rolling side to side
            const roll = Math.sin(time * 1.5) * 0.03;
            // Slight yaw
            const yaw = Math.PI / 6 + Math.sin(time * 0.2) * 0.03;

            const shipRotation = { yaw, pitch, roll };

            // Project all ship coordinates
            const projShipPoints = shipVertices.map(pt =>
                project3D(pt, shipRotation, waveOffset, shipBaseX, waveCenterY)
            );

            // Transducer point (bottom of the keel) to emit sonar from
            const transducerPos = projShipPoints[1]; // bottom center bow/mid

            // ==========================================
            // 4. DRAW THE 3D MOUNTED SHIP MODEL
            // ==========================================
            // Render hull panels with colors
            ctx.lineWidth = 1.5;

            // Draw boat lines
            ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
            ctx.shadowBlur = 4;
            ctx.shadowColor = colorCyan;

            shipLines.forEach(line => {
                const pt1 = projShipPoints[line[0]];
                const pt2 = projShipPoints[line[1]];
                if (pt1 && pt2) {
                    ctx.beginPath();
                    ctx.moveTo(pt1.x, pt1.y);
                    ctx.lineTo(pt2.x, pt2.y);
                    ctx.stroke();
                }
            });
            ctx.shadowBlur = 0; // reset shadow

            // RENDER SHIP DECKS FILL FOR 3D VOLUME LOOK
            ctx.fillStyle = "rgba(4, 18, 44, 0.85)";
            ctx.beginPath();
            ctx.moveTo(projShipPoints[2].x, projShipPoints[2].y);
            ctx.lineTo(projShipPoints[3].x, projShipPoints[3].y);
            ctx.lineTo(projShipPoints[4].x, projShipPoints[4].y);
            ctx.lineTo(projShipPoints[7].x, projShipPoints[7].y);
            ctx.lineTo(projShipPoints[6].x, projShipPoints[6].y);
            ctx.lineTo(projShipPoints[5].x, projShipPoints[5].y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // DRAW HULL PANELS (Stern Transom)
            ctx.fillStyle = "rgba(13, 148, 136, 0.25)";
            ctx.beginPath();
            ctx.moveTo(projShipPoints[0].x, projShipPoints[0].y);
            ctx.lineTo(projShipPoints[2].x, projShipPoints[2].y);
            ctx.lineTo(projShipPoints[5].x, projShipPoints[5].y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // ==========================================
            // 5. OCEAN SEA LEVEL (overlapping sine waves)
            // ==========================================
            const drawWave = (offsetY, amp, color, speedScale, phase) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(0, h);
                for (let x = 0; x <= w + 10; x += 10) {
                    const y = waveCenterY + offsetY + Math.sin(x * waveFreq + time * speedScale + phase) * amp;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(w, h);
                ctx.closePath();
                ctx.fill();
            };

            // Deepest back wave
            drawWave(4, 6, "rgba(8, 23, 50, 0.4)", 1.2, Math.PI / 4);
            // Mid wave
            drawWave(0, 10, "rgba(11, 33, 68, 0.45)", 1.5, 0);
            // Front wave covering bottom of ship hull
            drawWave(-3, 8, "rgba(6, 182, 212, 0.08)", 1.8, Math.PI / 2);

            // ==========================================
            // 6. DEEP SEABED BATHYMETRY WIREFRAME
            // ==========================================
            const seabedStartY = h * 0.78;
            const rows = 8;
            const cols = 14;
            ctx.strokeStyle = "rgba(6, 182, 212, 0.10)";
            ctx.lineWidth = 0.5;
            
            // Project grid vertices representing bathymetry
            const gridPoints = [];
            for (let r = 0; r < rows; r++) {
                gridPoints[r] = [];
                for (let c = 0; c < cols; c++) {
                    const gridX = (c / (cols - 1)) * w;
                    const gridScaleZ = r / (rows - 1); // Depth projection perspective

                    // Generate realistic irregular seabed topography (underwater valley/canyon)
                    const baseHeight = Math.sin(c * 0.3) * 15 + Math.cos(c * 0.6) * 5 + Math.sin(r * 0.5) * 8;
                    const topography = baseHeight * (1 - gridScaleZ * 0.3);

                    const rawY = seabedStartY + r * 14 + topography;
                    // Apply horizontal compression towards top for 3D perspective depth
                    const centeredX = w / 2 + (gridX - w / 2) * (0.6 + gridScaleZ * 0.5);

                    gridPoints[r][c] = { x: centeredX, y: rawY, val: topography };
                }
            }

            // Draw Grid Mesh Lines
            for (let r = 0; r < rows; r++) {
                // Draw rows
                ctx.beginPath();
                for (let c = 0; c < cols; c++) {
                    const pt = gridPoints[r][c];
                    if (c === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.stroke();
            }

            for (let c = 0; c < cols; c++) {
                // Draw columns
                ctx.beginPath();
                for (let r = 0; r < rows; r++) {
                    const pt = gridPoints[r][c];
                    if (r === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.stroke();
            }

            // SUBTLE GRID PULSE
            const pulsePhase = Math.sin(time * 1.5) * 0.5 + 0.5;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const pt = gridPoints[r][c];
                    const pulse = Math.sin((r + c) * 0.5 + time * 2) * 0.3 + 0.7;
                    ctx.fillStyle = `rgba(6, 182, 212, ${0.08 * pulse})`;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // ==========================================
            // 7. TICK & DRAW CLICK SONAR PING shockwaves
            // ==========================================
            pingsRef.current = pingsRef.current.filter(ping => {
                ping.radius += ping.speed;
                ping.alpha = 1.0 - (ping.radius / ping.maxRadius);

                if (ping.alpha <= 0) return false;

                ctx.strokeStyle = `rgba(6, 182, 212, ${ping.alpha * 0.6})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(ping.x, ping.y, ping.radius, ping.radius * 0.4, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Check intersection with grid points to light up nodes
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const pt = gridPoints[r][c];
                        const dist = Math.sqrt(Math.pow(pt.x - ping.x, 2) + Math.pow(pt.y - ping.y, 2));
                        if (Math.abs(dist - ping.radius) < 15) {
                            ctx.fillStyle = `rgba(13, 148, 136, ${ping.alpha})`;
                            ctx.beginPath();
                            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }

                return true;
            });

            // ==========================================
            // 8. INTERACTIVE DYNAMIC HUD CURSOR OVERLAY
            // ==========================================
            if (mouseRef.current.active) {
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;

                // Crosshairs targeting box
                ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
                ctx.lineWidth = 1;
                ctx.strokeRect(mx - 15, my - 15, 30, 30);
                ctx.beginPath();
                ctx.moveTo(mx - 25, my); ctx.lineTo(mx - 5, my);
                ctx.moveTo(mx + 5, my); ctx.lineTo(mx + 25, my);
                ctx.moveTo(mx, my - 25); ctx.lineTo(mx, my - 5);
                ctx.moveTo(mx, my + 5); ctx.lineTo(mx, my + 25);
                ctx.stroke();

                // Data flag pointing from mouse
                ctx.fillStyle = "rgba(4, 18, 44, 0.8)";
                ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
                ctx.lineWidth = 1;

                const boxW = 140;
                const boxH = 50;
                let boxX = mx + 20;
                let boxY = my - 60;

                // Screen boundaries helper
                if (boxX + boxW > w - 10) boxX = mx - boxW - 20;
                if (boxY < 10) boxY = my + 20;

                ctx.beginPath();
                ctx.rect(boxX, boxY, boxW, boxH);
                ctx.fill();
                ctx.stroke();

                // Text telemetry info
                ctx.font = '9px "Courier New", monospace';
                ctx.fillStyle = "#ffffff";

                const mousePctX = (mx / w).toFixed(4);
                const mousePctY = (my / h).toFixed(4);

                ctx.fillText(`UTM: E ${mousePctX} N ${mousePctY}`, boxX + 8, boxY + 16);
                ctx.fillText(`VAL: ${(my * 0.18 + Math.sin(mx * 0.05) * 4).toFixed(1)} m`, boxX + 8, boxY + 28);
                ctx.fillText("SYS: SCANNING...", boxX + 8, boxY + 40);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <div className="canvas-outer-wrapper">
            {/* Heads Up Display Overlay Info */}
            <div className="sonar-telemetry-overlay">
                <div className="hud-metric">
                    <span className="hud-title">LATITUDE</span>
                    <span className="hud-val monospace">{telemetry.lat}</span>
                </div>
                <div className="hud-metric">
                    <span className="hud-title">LONGITUDE</span>
                    <span className="hud-val monospace">{telemetry.lon}</span>
                </div>
                <div className="hud-metric-row">
                    <div className="hud-metric">
                        <span className="hud-title">DEPTH</span>
                        <span className="hud-val monospace accent-cyan">{telemetry.depth} m</span>
                    </div>
                    <div className="hud-metric">
                        <span className="hud-title">FREQUENCY</span>
                        <span className="hud-val monospace">{telemetry.sonarFreq} kHz</span>
                    </div>
                </div>
                <div className="hud-metric-row">
                    <div className="hud-metric">
                        <span className="hud-title">SPEED VESS.</span>
                        <span className="hud-val monospace">{telemetry.speed} kts</span>
                    </div>
                    <div className="hud-metric">
                        <span className="hud-title">SCAN RES.</span>
                        <span className="hud-val monospace accent-teal">{telemetry.scanProgress}%</span>
                    </div>
                </div>
                <div className="hud-ping-hint">
                    CLICK CANVAS FOR SONAR PING
                </div>
            </div>
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                className="interactive-ship-canvas"
            />
        </div>
    );
}

export default InteractiveShipCanvas;
