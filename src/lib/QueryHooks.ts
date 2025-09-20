import { useMutation, useQuery, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponsehandler } from "../Functions/ApiResponsehandler";

// Define the required shape of payload
interface PayloadShape {
  url: string;
  headers?: Record<string, any>;
  base_URL?: string;
  accessName?: string;            // now required
  [key: string]: any;            // extra fields
}

interface FetchFnArgs<T extends PayloadShape> {
  payload: T;
}

interface ApiResponse<T = any> {
  status?: number;
  msg?: string;
  logout?: boolean;
  data?: T;
}

const fetchFn = async <T extends PayloadShape, R>({ payload }: FetchFnArgs<T>): Promise<R> => {
  const res: ApiResponse<R> = await ApiResponsehandler(payload);

  if (res?.status === 200) {
    return res as R;
  } else if (res?.logout) {
    // Handle auto logout if needed
    throw new Error("User logged out");
  } else {
    throw new Error(res?.msg || "Unknown error");
  }
};

// ---------------- Custom Query Hook ----------------
interface UseCustomQueryProps<TData, TPayload extends PayloadShape> {
  queryProps?: UseQueryOptions<TData>;
  payload: TPayload;
}

function useCustomQuery<TData = any, TPayload extends PayloadShape = PayloadShape>({
  queryProps = {
    queryKey: []
  },
  payload,
}: UseCustomQueryProps<TData, TPayload>) {
  return useQuery<TData>({
    ...queryProps,
    queryFn: async () => fetchFn<TPayload, TData>({ payload }),
  });
}

// ---------------- Custom Mutation Hook ----------------
interface UseCustomMutationProps<TData, TVariables extends PayloadShape, TContext = unknown>
  extends UseMutationOptions<TData, unknown, TVariables, TContext> {}

function useCustomMutation<TData = any, TVariables extends PayloadShape = PayloadShape, TContext = unknown>(
  props: UseCustomMutationProps<TData, TVariables, TContext>
) {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation<TData, unknown, TVariables, TContext>({
      ...props,
      mutationFn: async (payload: TVariables) => fetchFn<TVariables, TData>({ payload }),
    }),
    queryClient,
  };
}

export { useCustomQuery, useCustomMutation };
