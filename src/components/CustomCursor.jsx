import { useState, useRef, useEffect } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const cursorDotRef = useRef(null);
    const canvasRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;
        const canvas = canvasRef.current;
        if (!cursor || !cursorDot || !canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        let mouseX = width / 2;
        let mouseY = height / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        // Particles for smoke wave effect
        let particles = [];
        let time = 0;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Instantly update inner dot
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        };

        // Smooth animation loop for the outer ring and canvas trail
        let animationFrameId;
        const render = () => {
            time += 0.1;
            const prevCursorX = cursorX;
            const prevCursorY = cursorY;

            cursorX += (mouseX - cursorX) * 0.2; // Ease amount
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

            // Spawn particles
            const dist = Math.hypot(cursorX - prevCursorX, cursorY - prevCursorY);

            if (dist > 0.5) {
                const steps = Math.max(1, Math.floor(dist / 3));
                for (let i = 0; i < steps; i++) {
                    const t = i / steps;
                    particles.push({
                        x: prevCursorX + (cursorX - prevCursorX) * t,
                        y: prevCursorY + (cursorY - prevCursorY) * t,
                        life: 1.0,
                        size: Math.random() * 2 + 1,
                        driftX: (Math.random() - 0.5) * 0.5,
                        phase: time + t * 0.1
                    });
                }
            } else if (Math.random() < 0.2) {
                // Occasional particle when still
                particles.push({
                    x: cursorX,
                    y: cursorY,
                    life: 1.0,
                    size: Math.random() * 2 + 1,
                    driftX: (Math.random() - 0.5) * 0.5,
                    phase: time
                });
            }

            // Draw smoke wave trail
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = "screen";

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.life -= 0.04; // Fade out faster so smoke is shorter
                p.size += 0.3;   // Smoke expands
                p.phase += 0.05; // Wavy phase progresses

                // Wavy movement + upwards drift
                p.x += Math.sin(p.phase) * 1.5 + p.driftX;
                p.y -= 1;

                if (p.life > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                    // Glowing purple / indigo tint
                    ctx.fillStyle = `rgba(168, 85, 247, ${p.life * 0.35})`;
                    ctx.fill();
                }
            }

            ctx.globalCompositeOperation = "source-over"; // Reset

            // Clean up dead particles
            particles = particles.filter(p => p.life > 0);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const onMouseOver = (e) => {
            const target = e.target;
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('nav-dot')
            ) {
                setIsHovering(true);
            }
        };

        const onMouseOut = () => setIsHovering(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        window.addEventListener('mouseout', onMouseOut);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mouseout', onMouseOut);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className="v2d-cursor-canvas" />
            <div ref={cursorRef} className={`v2d-cursor ${isHovering ? 'hover' : ''}`} />
            <div ref={cursorDotRef} className={`v2d-cursor-dot ${isHovering ? 'hover' : ''}`} />
        </>
    );
}
