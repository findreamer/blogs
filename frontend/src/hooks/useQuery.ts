import { useMemo } from "react";
import { useLocation } from "react-router";

export const useQuery = <T extends Record<string, string>>() => {
  const { search } = useLocation();

  const query = useMemo<T>(() => {
    const searchParams = new URLSearchParams(search);
    const obj: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      obj[key] = value;
    }
    return obj as unknown as T;
  }, [search]);

  return query;
};
