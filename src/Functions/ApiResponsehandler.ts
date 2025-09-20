import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import toastHandler from "./Toasthandler";
import allEnv from "../constant/index";

const toast = toastHandler();

interface ApiResponseHandlerOptions extends AxiosRequestConfig {
  url: string;
  base_URL?: string;
  accessName?: string;
  headers?: Record<string, string>;
  withoutToken?: boolean;
  noBase?: boolean;
  wantToast?: boolean;
}

interface ApiResponse<T = any> {
  data?: T;
  status?: number;
  msg?: string;
  logout?: boolean;
  error?: boolean;
}

export const ApiResponsehandler = async <T = any>({
  url,
  headers,
  base_URL,
  accessName,
  ...restConfig
}: ApiResponseHandlerOptions): Promise<ApiResponse<T>> => {
  const accessToken = Cookies.get("accessToken");

  const allHeaders: Record<string, string> = {
    Authorization: "Basic cHJlcEluc3RhOnByZXAxMjNASW5zdGE==",
    "Content-Type": "application/json",
  };

  if (!restConfig?.withoutToken && accessToken) {
    allHeaders[accessName || "accessToken"] = accessToken;
  }

  const config: AxiosRequestConfig = {
    url: restConfig?.noBase
      ? url
      : (base_URL
          ? allEnv[base_URL as keyof typeof allEnv]
          : allEnv?.BASE_URL) + url,
    method: "GET",
    ...restConfig,
    headers: { ...allHeaders, ...headers },
  };

  try {
    const { data }: AxiosResponse<any> = await axios(config);
    const response: ApiResponse<T> = data?.res
      ? { ...data?.res, status: data?.status }
      : { data, status: data?.status || 200 };
    if (response?.status === 200) {
      restConfig?.wantToast && response?.msg && toast("sus", response?.msg);
      return response;
    } else if (response?.error) {
      restConfig?.wantToast && response?.msg && toast("warn", response?.msg);
      return response;
    }

    return response;
  } catch (error: any) {
    let res = error?.response?.data || {};

    if (typeof res === "string") {
      try {
        res = JSON.parse(res);
      } catch (e) {
        res = { err: { msg: res } };
      }
    }

    const finalRes: ApiResponse = {
      msg: res?.err?.msg || "",
      status: res?.status,
    };
    if (res?.status === 402 || res?.status === 401) {
      finalRes.logout = true;
    } else if (error?.code === "ERR_NETWORK") {
      finalRes.msg = error?.message;
      finalRes.status = 0;
    }

    if (restConfig?.wantToast && res?.err?.msg) {
      toast("dan", res?.err?._message || res?.err?.msg);
    }

    return finalRes;
  }
};
