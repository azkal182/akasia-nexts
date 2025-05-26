import { NavItem } from "../../types";

export type Product = {
    photo_url: string;
    name: string;
    description: string;
    created_at: string;
    price: number;
    id: number;
    category: string;
    updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: "dashboard",
        isActive: false,
        shortcut: ["d", "d"],
        items: [],
    },
];

export const navItemsTransaction: NavItem[] = [
    {
        title: "Pemasukan",
        url: "/dashboard/pemasukan",
        icon: "HandCoins",
        isActive: false,
        shortcut: ["d", "d"],
        items: [],
    },
    {
        title: "Pengeluaran",
        url: "/dashboard/pengeluaran",
        icon: "Banknote",
        isActive: false,
        shortcut: ["d", "d"],
        items: [],
    },
    {
        title: "Pengajuan",
        url: "/dashboard/pengajuan",
        icon: "Banknote",
        isActive: false,
        items: [],
    },
];

export const navItemsDriver: NavItem[] = [
    {
        title: "Perizinan",
        url: "/dashboard/perizinan",
        icon: "Car",
        isActive: false,
        // shortcut: ["c", "c"],
        items: [],
    },
    {
        title: "Armada",
        url: "/dashboard/cars",
        icon: "Car",
        isActive: false,
        shortcut: ["c", "c"],
        items: [],
    },
    {
        title: "Riwayat",
        url: "/dashboard/history",
        icon: "history",
        isActive: false,
        shortcut: ["h", "h"],
        items: [],
    },
];
export interface SaleUser {
    id: number;
    name: string;
    email: string;
    amount: string;
    image: string;
    initials: string;
}

export const recentSalesData: SaleUser[] = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        amount: "+$1,999.00",
        image: "https://api.slingacademy.com/public/sample-users/1.png",
        initials: "OM",
    },
    {
        id: 2,
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        amount: "+$39.00",
        image: "https://api.slingacademy.com/public/sample-users/2.png",
        initials: "JL",
    },
    {
        id: 3,
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        amount: "+$299.00",
        image: "https://api.slingacademy.com/public/sample-users/3.png",
        initials: "IN",
    },
    {
        id: 4,
        name: "William Kim",
        email: "will@email.com",
        amount: "+$99.00",
        image: "https://api.slingacademy.com/public/sample-users/4.png",
        initials: "WK",
    },
    {
        id: 5,
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        amount: "+$39.00",
        image: "https://api.slingacademy.com/public/sample-users/5.png",
        initials: "SD",
    },
];
