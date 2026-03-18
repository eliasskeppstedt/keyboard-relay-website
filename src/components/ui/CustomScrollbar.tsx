import React, { useEffect, useRef, useState, useCallback } from 'react';

interface CustomScrollbarProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  scrollRef,
  className = '',
  orientation = 'horizontal',
}) => {
  const [thumbSize, setThumbSize] = useState(0);
  const [thumbPosition, setThumbPosition] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef(0);
  const startScroll = useRef(0);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (orientation === 'horizontal') {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollWidth <= clientWidth) {
        setThumbSize(0);
        return;
      }
      const trackWidth = trackRef.current?.clientWidth || clientWidth || 1;
      const size = (clientWidth / scrollWidth) * trackWidth;
      const pos = (scrollLeft / (scrollWidth - clientWidth)) * (trackWidth - size);
      setThumbSize(Math.max(size, 20));
      setThumbPosition(pos);
    } else {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight) {
        setThumbSize(0);
        return;
      }
      const trackHeight = trackRef.current?.clientHeight || clientHeight || 1;
      const size = (clientHeight / scrollHeight) * trackHeight;
      const pos = (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - size);
      setThumbSize(Math.max(size, 20));
      setThumbPosition(pos);
    }
  }, [scrollRef, orientation]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => updateThumb();
    el.addEventListener('scroll', handleScroll);

    // Initial and resize observer
    // Do two frames: first paint creates layout, second has stable sizes.
    const raf1 = requestAnimationFrame(() => {
      updateThumb();
      requestAnimationFrame(updateThumb);
    });
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    if (trackRef.current) ro.observe(trackRef.current);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf1);
      ro.disconnect();
    };
  }, [scrollRef, updateThumb]);

  const onMouseUpRef = useRef<() => void>(() => {});

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !scrollRef.current || !trackRef.current) return;

    const el = scrollRef.current;
    const delta = (orientation === 'horizontal' ? e.clientX : e.clientY) - startPos.current;

    if (orientation === 'horizontal') {
      const { scrollWidth, clientWidth } = el;
      const trackBoundsWidth = trackRef.current.clientWidth;
      const ratio = (scrollWidth - clientWidth) / (trackBoundsWidth - thumbSize);
      el.scrollLeft = startScroll.current + delta * ratio;
    } else {
      const { scrollHeight, clientHeight } = el;
      const trackBoundsHeight = trackRef.current.clientHeight;
      const ratio = (scrollHeight - clientHeight) / (trackBoundsHeight - thumbSize);
      el.scrollTop = startScroll.current + delta * ratio;
    }
  }, [scrollRef, orientation, thumbSize]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUpRef.current);
  }, [onMouseMove]);

  // Keep ref in sync so onMouseDown can always reference the latest onMouseUp
  useEffect(() => {
    onMouseUpRef.current = onMouseUp;
  });

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setDragging(true);
    startPos.current = orientation === 'horizontal' ? e.clientX : e.clientY;
    startScroll.current = orientation === 'horizontal'
      ? scrollRef.current?.scrollLeft || 0
      : scrollRef.current?.scrollTop || 0;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUpRef.current);
    e.preventDefault();
  };

  const scrollBy = (amount: number) => {
    if (!scrollRef.current) return;
    if (orientation === 'horizontal') {
      scrollRef.current.scrollLeft += amount;
    } else {
      scrollRef.current.scrollTop += amount;
    }
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 select-none ${className} ${thumbSize === 0 ? 'pointer-events-none opacity-0' : ''}`}
      aria-hidden={thumbSize === 0}
    >
      {/* Arrow Left/Up */}
      <button
        onClick={() => scrollBy(-100)}
        className="text-muted/40 hover:text-accent transition-colors"
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor">
          <path d={orientation === 'horizontal' ? "M5 1L1 5L5 9" : "M1 5L5 1L9 5"} />
        </svg>
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative flex-1 h-[6px] bg-white/5 rounded-full overflow-hidden"
      >
        {/* Thumb */}
        <div
          onMouseDown={onMouseDown}
          className={`absolute rounded-full transition-colors hover:bg-accent ${dragging ? 'bg-accent' : 'bg-muted/40'}`}
          style={{
            width: orientation === 'horizontal' ? thumbSize : '100%',
            height: orientation === 'vertical' ? thumbSize : '100%',
            left: orientation === 'horizontal' ? thumbPosition : 0,
            top: orientation === 'vertical' ? thumbPosition : 0,
          }}
        />
      </div>

      {/* Arrow Right/Down */}
      <button
        onClick={() => scrollBy(100)}
        className="text-muted/40 hover:text-accent transition-colors"
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor">
          <path d={orientation === 'horizontal' ? "M1 1L5 5L1 9" : "M1 1L5 5L1 9"} />
        </svg>
      </button>
    </div>
  );
};
