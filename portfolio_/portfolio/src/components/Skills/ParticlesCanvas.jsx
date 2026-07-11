import { useEffect, useRef } from "react";
import "./ParticlesCanvas.css";

function ParticlesCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Scaling helper
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            const width = parent.clientWidth || window.innerWidth;
            const height = parent.clientHeight || window.innerHeight;
            const dpr = window.devicePixelRatio || 1;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            ctx.scale(dpr, dpr);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Particle class/structure
        const particles = [];
        const particleCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 22000));
        const maxDistance = 110;

        const mouse = {
            x: null,
            y: null,
            radius: 150,
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        // Initialize particles
        const initParticles = () => {
            particles.length = 0;
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45,
                    size: Math.random() * 2 + 1,
                    color: Math.random() > 0.45 ? "rgba(6, 182, 212, 0.4)" : "rgba(13, 148, 136, 0.4)",
                });
            }
        };

        initParticles();

        // Render loop
        const animate = () => {
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            ctx.clearRect(0, 0, w, h);

            // Render relationships/connections
            for (let a = 0; a < particles.length; a++) {
                const pA = particles[a];

                // Move particle
                pA.x += pA.vx;
                pA.y += pA.vy;

                // Bounce/Wrap boundaries
                if (pA.x < 0 || pA.x > w) pA.vx = -pA.vx;
                if (pA.y < 0 || pA.y > h) pA.vy = -pA.vy;

                // Mouse attraction (magnetic connection)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - pA.x;
                    const dy = mouse.y - pA.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        // Pull particles slightly toward mouse
                        const force = (mouse.radius - dist) / mouse.radius;
                        pA.x += (dx / dist) * force * 0.8;
                        pA.y += (dy / dist) * force * 0.8;
                    }
                }

                // Draw particle node
                ctx.fillStyle = pA.color;
                ctx.beginPath();
                ctx.arc(pA.x, pA.y, pA.size, 0, Math.PI * 2);
                ctx.fill();

                // Connect lines
                for (let b = a + 1; b < particles.length; b++) {
                    const pB = particles[b];
                    const dx = pA.x - pB.x;
                    const dy = pA.y - pB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const alpha = (1 - distance / maxDistance) * 0.15;
                        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(pA.x, pA.y);
                        ctx.lineTo(pB.x, pB.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="skills-particles-canvas" />;
}

export default ParticlesCanvas;
