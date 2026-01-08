import { useCallback, useRef, useState } from 'react';

/**
 * 防抖 Hook，用于防止快速连续点击
 * @param callback 要执行的回调函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
};

/**
 * 状态锁定 Hook，用于防止重复操作
 * @returns [isLoading, withLoading] - isLoading 状态和 withLoading 包装函数
 */
export const useLoadingLock = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T | undefined> => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      return await asyncFn();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  return [isLoading, withLoading] as const;
};