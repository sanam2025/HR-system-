// core/modules/HR/hooks/useApi.ts
import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: <R = T>(promise: Promise<R>, showLoading?: boolean) => Promise<R>;
  reset: () => void;
}

export function useApi<T>(): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async <R = T>(promise: Promise<R>, showLoading: boolean = true): Promise<R> => {
    if (showLoading) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }
    try {
      const result = await promise;
      // فقط إذا كان R هو نفس T نخزن البيانات
      if (result && typeof result === 'object' && !('length' in result)) {
        // يمكن تحديث state إذا أردت
      }
      setState(prev => ({ ...prev, loading: false, error: null }));
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: message });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}