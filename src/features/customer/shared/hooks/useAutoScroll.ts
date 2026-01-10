import { useEffect, useState, RefObject } from 'react';

export const useAutoScroll = (containerRef: RefObject<HTMLDivElement>) => {
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    if (!isAutoScrolling) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    let scrollPosition = 0;
    let direction = 1; // 1 为向右，-1 为向左

    const autoScroll = () => {
      if (!container) return;

      // 每次滚动的距离
      const scrollStep = 2;
      scrollPosition += scrollStep * direction;

      // 到达右边界时反向
      if (scrollPosition >= maxScroll) {
        direction = -1;
        scrollPosition = maxScroll;
      }
      // 到达左边界时反向
      else if (scrollPosition <= 0) {
        direction = 1;
        scrollPosition = 0;
      }

      container.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(autoScroll, 50); // 每50ms滚动一次

    return () => clearInterval(intervalId);
  }, [isAutoScrolling, containerRef]);

  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  return {
    isAutoScrolling,
    handleMouseEnter,
    handleMouseLeave
  };
};