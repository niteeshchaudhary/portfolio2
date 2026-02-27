import { useRef, useEffect } from 'react';

export default function ParallaxBackground({ containerRef }) {
    const bgRef = useRef(null);

    useEffect(() => {
        const bg = bgRef.current;
        const container = containerRef.current;
        if (!bg || !container) return;

        // We'll use CSS variables to pass scroll and mouse data
        const handleScroll = () => {
            const scrollY = container.scrollTop;
            const maxScroll = Math.max(1, container.scrollHeight - container.clientHeight);
            const progress = scrollY / maxScroll;
            bg.style.setProperty('--scroll-p', progress);
        };

        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            bg.style.setProperty('--mouse-x', x);
            bg.style.setProperty('--mouse-y', y);
        };

        // Initialize once
        handleScroll();

        container.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [containerRef]);

    return (
        <div className="v2d-parallax-bg" ref={bgRef}>
            <div className="v2d-layer v2d-layer-sky" />
            <div className="v2d-layer v2d-layer-stars" />
            <div className="v2d-layer v2d-layer-moon" />
            <div className="v2d-layer v2d-layer-clouds-back" />
            <div className="v2d-layer v2d-layer-clouds-front" />
            <div className="v2d-layer v2d-layer-mountains-back" />
            <div className="v2d-layer v2d-layer-mountains-front" />
            <div className="v2d-layer v2d-layer-trees-back" />
            <div className="v2d-layer v2d-layer-trees-front" />
        </div>
    );
}
