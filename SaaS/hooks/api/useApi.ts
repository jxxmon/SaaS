/**
 * useApi Hook
 * React hook for making API calls with loading, error, and data states
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { apiClient, ApiResponse, ApiError } from '@/lib/api/client';

interface UseApiOptions<T> {
  initialData?: T;
  manual?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onFinally?: () => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (config?: any) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

export function useApi<T = any>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    initialData = null,
    manual = false,
    onSuccess,
    onError,
    onFinally,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    status: 'idle',
  });

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (config?: any): Promise<T | null> => {
      if (!isMounted.current) return null;

      setState({
        data: state.data,
        loading: true,
        error: null,
        status: 'loading',
      });

      try {
        let response: ApiResponse<T>;

        switch (method) {
          case 'get':
            response = await apiClient.get<T>(url, config);
            break;
          case 'post':
            response = await apiClient.post<T>(url, config?.data, config);
            break;
          case 'put':
            response = await apiClient.put<T>(url, config?.data, config);
            break;
          case 'patch':
            response = await apiClient.patch<T>(url, config?.data, config);
            break;
          case 'delete':
            response = await apiClient.delete<T>(url, config);
            break;
          default:
            throw new Error();
        }

        if (!isMounted.current) return null;

        setState({
          data: response.data,
          loading: false,
          error: null,
          status: 'success',
        });

        onSuccess?.(response.data);
        return response.data;
      } catch (error) {
        if (!isMounted.current) return null;

        const apiError = error as ApiError;
        setState({
          data: state.data,
          loading: false,
          error: apiError,
          status: 'error',
        });

        onError?.(apiError);
        return null;
      } finally {
        if (isMounted.current) {
          onFinally?.();
        }
      }
    },
    [method, url, state.data, onSuccess, onError, onFinally]
  );

  const reset = useCallback(() => {
    if (!isMounted.current) return;
    setState({
      data: initialData,
      loading: false,
      error: null,
      status: 'idle',
    });
  }, [initialData]);

  const setData = useCallback((data: T | null) => {
    if (!isMounted.current) return;
    setState((prev) => ({
      ...prev,
      data,
    }));
  }, []);

  // Auto-execute on mount if not manual
  useEffect(() => {
    if (!manual && method === 'get') {
      execute();
    }
  }, [manual, method, execute]);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

// Convenience hooks
export function useGet<T = any>(url: string, options?: UseApiOptions<T>) {
  return useApi<T>('get', url, options);
}

export function usePost<T = any>(url: string, options?: UseApiOptions<T>) {
  return useApi<T>('post', url, options);
}

export function usePut<T = any>(url: string, options?: UseApiOptions<T>) {
  return useApi<T>('put', url, options);
}

export function usePatch<T = any>(url: string, options?: UseApiOptions<T>) {
  return useApi<T>('patch', url, options);
}

export function useDelete<T = any>(url: string, options?: UseApiOptions<T>) {
  return useApi<T>('delete', url, options);
}
EOF'
