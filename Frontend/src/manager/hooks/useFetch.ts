// src/manager/hooks/useFetch.ts
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T,>(url: string) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<T>(url);
        if (isMounted) {
          setState({ data: response.data, loading: false, error: null });
        }
      } catch (error: any) {
        if (isMounted) {
          setState({ data: null, loading: false, error: error.message });
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};

export default useFetch;
