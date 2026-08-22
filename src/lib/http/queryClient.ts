import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./ApiError";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const apiError = error instanceof ApiError ? error : ApiError.from(error);
        if (
          apiError.isValidation ||
          apiError.isUnauthenticated ||
          apiError.kind === "forbidden" ||
          apiError.kind === "not_found"
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
