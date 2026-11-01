import { useState, useCallback } from 'react';

/**
 * Generic async state hook for API calls.
 * Returns { data, loading, error, execute }
 */
export function useAsync(asyncFn) {
  const [state, setState] = useState({ data: null, loading: false, error: null });

  const execute = useCallback(
    async (...args) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await asyncFn(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        setState({ data: null, loading: false, error: err.message || 'An error occurred' });
        throw err;
      }
    },
    [asyncFn]
  );

  return { ...state, execute };
}
