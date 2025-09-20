"use client";
import { useEffect, useState } from "react";
import { useCustomMutation, useCustomQuery } from "@/lib/QueryHooks";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const {
    data: user,
    isPending: userQueryLoading,
    isFetching: userQueryFetching,
    ...rest
  } = useCustomQuery({
    queryProps: {
      queryKey: ["user"],
    },
    payload: {
      url: "user/profile",
    },
  });

  useEffect(() => {
    if (!userQueryLoading || !userQueryFetching) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, userQueryLoading, userQueryFetching]);

  return (
    <div className="p-6">
      {user ? (
        <h1 className="text-xl font-bold">Welcome, {user.email} 🎉</h1>
      ) : (
        <h1 className="text-xl font-bold">Loading user...</h1>
      )}
    </div>
  );
}
