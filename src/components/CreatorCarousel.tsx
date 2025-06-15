
import React, { useRef, useEffect } from "react";

export interface CreatorCarouselProps {
  carousel: any[];
}

const CreatorCarousel: React.FC<CreatorCarouselProps> = ({ carousel }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Optionally: carousel auto-scroll
  useEffect(() => {
    const el = carouselRef.current;
    if (el && carousel.length > 1) {
      let frame: number | undefined;
      let dir = 1;
      function scrollStep() {
        let max = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= max) dir = -1;
        if (el.scrollLeft <= 0) dir = 1;
        el.scrollLeft += 0.3 * dir;
        frame = requestAnimationFrame(scrollStep);
      }
      frame = requestAnimationFrame(scrollStep);
      return () => frame && cancelAnimationFrame(frame);
    }
  }, [carousel.length]);

  return (
    <div className="carousel flex gap-6 overflow-x-auto py-8 hide-scrollbar w-full max-w-5xl" ref={carouselRef} role="list">
      {carousel.length === 0 && (
        <div className="opacity-70 text-sm italic text-neutral-400 p-8">
          Recent creator drops will appear here soon!
        </div>
      )}
      {carousel.map((proj, i) => (
        <div
          className="card w-56 flex-shrink-0 bg-[#1E1E1E] rounded shadow-inner border border-accent/20 focus-visible:ring-2 focus-visible:ring-gold"
          key={proj.id || i}
          role="listitem"
          tabIndex={0}
          aria-label={`Drop: ${proj.project_idea?.slice(0, 40)}`}
        >
          <img
            src={proj.cover_art_url || "/placeholder.svg"}
            alt={proj.project_idea?.slice(0, 40) || "Cover Art"}
            className="rounded-t w-full h-36 object-cover"
          />
          <div className="p-4 text-sm">
            “{proj.project_idea?.slice(0, 45) || "Exciting project..."}”
            <br />
            <span className="text-[#9A4DFF] font-mono">
              @{(proj.wallet_address && proj.wallet_address.slice(0, 8) + '…') || "creator"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreatorCarousel;

