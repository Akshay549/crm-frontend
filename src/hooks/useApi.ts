import { useEffect, useState } from "react";
import { toApiError, type ApiError } from "@/lib/api-error";

type Result<T> = { key: string; data?: T; error?: ApiError };

// Runs an API call on mount and again whenever `deps` change.
//  loading: true until a result arrives for the current deps
//  reload:  fetches again; the old data stays on screen until the new data arrives
//  update:  replaces the data with a response we already have (no extra request)
export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[]) {
  const key = JSON.stringify(deps);
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<Result<T>>();

  useEffect(() => {
    let ignore = false;

    fetcher()
      .then((data) => {
        if (!ignore) setResult({ key, data });
      })
      .catch((error) => {
        if (!ignore) setResult({ key, error: toApiError(error) });
      });

    // Ignore the answer of an outdated request
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);

  const current = result?.key === key ? result : undefined;

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: !current,
    reload: () => {
      if (current?.error) setResult(undefined); // retry after an error shows the loader again
      setVersion((v) => v + 1);
    },
    update: (data: T) => setResult({ key, data }),
  };
}
