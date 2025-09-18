export interface SidebarItem {
    _id: string;
    title: string;
    type: "item" | "group";
    url?: string;
    icon?: string;
    children?: SidebarItem[];
    isDeleted: boolean;
    created: string;
    updated: string;
  }

