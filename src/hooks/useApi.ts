import { useEffect, useState } from "react";
import { toApiError, type ApiError } from "@/lib/api-error";

type Result<T> = { key: string; data?: T; error?: ApiError };

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
    initialLoading: !result,
    reload: () => {
      if (current?.error) setResult(undefined);
      setVersion((v) => v + 1);
    },
    update: (data: T) => setResult({ key, data }),
  };
}
