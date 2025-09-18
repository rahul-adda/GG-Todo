import { SidebarItem } from "@/types/sidebar";

export const filterSidebarByRole = (items: SidebarItem[], role: number) => {
  if (role === 1) return items;       // Admin / SubAdmin
  if (role === 2) return [];          // Normal User (no sidebar)
  return [];                          // Default empty
};
