"use client";

import { useCustomQuery } from "@/lib/QueryHooks";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const [redirected, setRedirected] = useState(false);

  const { user, isPending, isFetching, error } = useUserProfile(!!Cookies.get("accessToken"));

  useEffect(() => {
    if (isPending || isFetching) return;

    if (redirected) return;

    if (!user) {
      if (pathname !== "/login" && pathname !== "/signup") {
        setRedirected(true);
        router.replace("/login");
      }
      return;
    }

    if (pathname === "/login" || pathname === "/signup") {
      setRedirected(true);
      router.replace("/dashboard");
      return;
    }

    if (pathname?.startsWith("/users") && user.role !== 1) {
      setRedirected(true);
      router.replace("/");
      return;
    }
  }, [user, isPending, isFetching, pathname, redirected, router]);

  return {
    user,
    isLoading: isPending || isFetching,
  };
}

export function useUserProfile(fetchEnabled: boolean = true) {
  const payload = useMemo(() => ({ url: "user/profile" }), []);

  const { data: user, isPending, isFetching, error } = useCustomQuery({
    queryProps: {
      queryKey: ["user"],
      // enabled: false,
    },
    payload,
  });

  return { user, isPending, isFetching, error };
}