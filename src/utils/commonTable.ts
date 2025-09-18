import { useSearchParams } from "next/navigation";

type SearchParamsType = ReturnType<typeof useSearchParams>;

export function debounce<F extends (...args: any[]) => void>(func: F, delay: number) {
    let timer: any;
    return function (...args: Parameters<F>) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    } as F;
  }

  export function allSearchParams(searchParams: SearchParamsType) {
    return searchParams ? Object.fromEntries(searchParams.entries()) : null;
  }
  
  export const getPaginationParams = (searchParams: SearchParamsType) => {
    const params = allSearchParams(searchParams) || {} as Record<string, any>;
    const page = params.page ? Number(params.page) - 1 : 0;
    const limit = params.limit ? Number(params.limit) : 10;
    return { ...params, page, limit };
  };
  
  export function paramsToString(obj: Record<string, any>) {
    if (Object.keys(obj).length) {
      const params = new URLSearchParams(obj as any);
      return params.toString();
    }
    return "";
  }
  