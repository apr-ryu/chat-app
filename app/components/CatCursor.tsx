"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function CatCursor() {
  const catRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  const cat = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrame: number;

    const animate = () => {
      const speed = 0.08;

      cat.current.x += (mouse.current.x - cat.current.x) * speed;
      cat.current.y += (mouse.current.y - cat.current.y) * speed;

      if (catRef.current) {
        catRef.current.style.transform = `
          translate(
            ${cat.current.x + 12}px,
            ${cat.current.y + 12}px
          )
        `;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={catRef} className="cat-cursor">
      <Image src="/cat_cursor.png" alt="" width={75} height={80} />
    </div>
  );
}
