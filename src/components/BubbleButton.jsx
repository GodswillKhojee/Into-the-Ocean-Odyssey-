import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

const COLORS = [
  "#85B7EB", "#B5D4F4", "#5DCAA5",
  "#9FE1CB", "#AFA9EC", "#CECBF6", "#F4C0D1",
];

export default function BubbleButton({ label = "hover me", onClick }) {
  const btnRef = useRef(null);
  const svgRef = useRef(null);
  const bubblesRef = useRef([]);
  const intervalRef = useRef(null);

  const getCenter = useCallback(() => {
    const br = btnRef.current.getBoundingClientRect();
    const wr = svgRef.current.getBoundingClientRect();
    return {
      x: br.left - wr.left + br.width / 2,
      y: br.top - wr.top + br.height / 2,
      w: br.width,
      h: br.height,
    };
  }, []);

  const spawnBubble = useCallback(() => {
    const svg = svgRef.current;
    const c = getCenter();
    const r = 6 + Math.random() * 12;
    const angle = Math.random() * Math.PI * 2;
    const edge = Math.random() * c.w * 0.5;
    const sx = c.x + Math.cos(angle) * edge;
    const sy = c.y + Math.sin(angle) * (c.h * 0.4);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", r);
    circle.setAttribute("cx", sx);
    circle.setAttribute("cy", sy);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", COLORS[Math.floor(Math.random() * COLORS.length)]);
    circle.setAttribute("stroke-width", "1.5");
    circle.setAttribute("opacity", "0");
    svg.appendChild(circle);

    const dx = (Math.random() - 0.5) * 60;
    const dy = -(40 + Math.random() * 70);

    gsap.timeline({
      onComplete: () => {
        circle.remove();
        bubblesRef.current = bubblesRef.current.filter((b) => b !== circle);
      },
    })
      .to(circle, { opacity: 0.85, duration: 0.2, ease: "power2.out" })
      .to(circle, {
        cx: sx + dx, cy: sy + dy,
        r: r * 1.15, opacity: 0,
        duration: 1.1 + Math.random() * 0.6,
        ease: "power1.out",
      }, 0.1);

    bubblesRef.current.push(circle);
  }, [getCenter]);

  const popBubble = useCallback((circle) => {
    const svg = svgRef.current;
    gsap.killTweensOf(circle);
    const cx = parseFloat(circle.getAttribute("cx"));
    const cy = parseFloat(circle.getAttribute("cy"));
    const r  = parseFloat(circle.getAttribute("r"));
    const col = circle.getAttribute("stroke");
    circle.remove();

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("r", 2.5);
      dot.setAttribute("cx", cx);
      dot.setAttribute("cy", cy);
      dot.setAttribute("fill", col);
      dot.setAttribute("opacity", "1");
      svg.appendChild(dot);
      gsap.to(dot, {
        cx: cx + Math.cos(a) * (r + 14 + Math.random() * 10),
        cy: cy + Math.sin(a) * (r + 14 + Math.random() * 10),
        opacity: 0, r: 1,
        duration: 0.38 + Math.random() * 0.2,
        ease: "power2.out",
        onComplete: () => dot.remove(),
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    gsap.to(btnRef.current, { scale: 1.06, duration: 0.25, ease: "back.out(2)" });
    intervalRef.current = setInterval(spawnBubble, 180);
  }, [spawnBubble]);

  const handleMouseLeave = useCallback(() => {
    gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: "elastic.out(1,0.5)" });
    clearInterval(intervalRef.current);
  }, []);

  const handleClick = useCallback(() => {
    gsap.timeline()
      .to(btnRef.current, { scale: 0.88, duration: 0.08, ease: "power2.in" })
      .to(btnRef.current, { scale: 1.1,  duration: 0.15, ease: "back.out(3)" })
      .to(btnRef.current, { scale: 1,    duration: 0.25, ease: "elastic.out(1,0.4)" });

    [...bubblesRef.current].forEach(popBubble);
    bubblesRef.current = [];
    onClick?.();
  }, [popBubble, onClick]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        ref={svgRef}
        className="absolute pointer-events-none overflow-visible"
        style={{ inset: "-60px", width: "calc(100% + 120px)", height: "calc(100% + 120px)" }}
      />
      <button
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative z-10 px-11 py-4 rounded-full border-4 p-4 text-[#E6F1FB] text-[15px] font-medium tracking-wider cursor-pointer select-none outline-none "
      >
        {label}
      </button>
    </div>
  );
}