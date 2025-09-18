"use client";
import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

export type IUser = {
  _id: string;
  name: string;
  email: string;
  role: number; // 1 = admin (sidebar visible), 2 = regular
  avatar: string;
  createdAt: string
};

export function useAuth() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/api/auth/me')
      .then(res => { if (mounted) setUser(res.data.user); })
      .catch(() => { if (mounted) setUser(null); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { user, loading, isAuthenticated: !!user, setUser };
}
