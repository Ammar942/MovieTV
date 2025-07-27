// frontend/src/hooks/useInfiniteScroll.ts
import { useRef, useEffect, useCallback } from "react";

interface UseInfiniteScrollOptions {
  callback: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number; // Distance from bottom to trigger load (e.g., 0.1 for 10% from bottom)
}

export const useInfiniteScroll = ({
  callback,
  hasMore,
  isLoading,
  threshold = 0.1,
}: UseInfiniteScrollOptions) => {
  const observerTarget = useRef<HTMLDivElement>(null); // Ref for the element to observe
  console.log(hasMore);
  const handleObserver = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      // Check if the target is intersecting and there's more data to load and not currently loading
      if (entry.isIntersecting && hasMore && !isLoading) {
        callback();
      }
    },
    [callback, hasMore, isLoading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // Use the viewport as the root
      rootMargin: `0px 0px ${Math.round(window.innerHeight * threshold)}px 0px`, // Load when target is within threshold distance from bottom
      threshold: 0.1, // Trigger when 10% of the target is visible (can be adjusted)
    });

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    // Cleanup function
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleObserver, threshold]); // Re-run effect if handleObserver or threshold changes

  return observerTarget;
};
