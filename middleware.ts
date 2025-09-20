import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import Cookies from "js-cookie";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import allEnv from "./src/constant/index";

const protectedRoutes = ["/dashboard", "/users"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = cookies().get("accessToken")?.value;
  const allHeaders: Record<string, string> = {
    Authorization: `Basic ${process.env.BasicAuth}`,
    "Content-Type": "application/json",
  };

  if (accessToken) allHeaders["accessToken"] = accessToken;

  const config: AxiosRequestConfig = {
    url:  allEnv?.BASE_URL + 'user/profile',
    method: "GET",
    headers: { ...allHeaders },
  };
  
  let isValidToken = false;
  if (accessToken) {
    try {
      const { data }: AxiosResponse<any> = await axios(config);
      if(data.status === 200) isValidToken = true;
    } catch (err) {
      console.error("Token verification failed:", err);
    }
  }

  // Protected route check
  if (isProtectedRoute && !isValidToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Public route check
  if (isPublicRoute && isValidToken) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
