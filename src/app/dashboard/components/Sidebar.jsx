"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useApiGet } from "@/hooks/useApi";
import { apiFetcher } from "@/lib/api";
import { useTranslations } from "next-intl";
import {
  Wrench,
  Smartphone,
  LogOut,
  ChevronDown,
  ChevronRight,
  Tag,
  List,
  Smartphone as PhoneIcon,
  Percent,
  Palette,
  Users,
  Package,
  X,
  Home,
  ShoppingBag,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

// Navigation will be created inside component to use translations

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState([t('sidebar.orderManagement')]);

  // Navigation with translations
  const navigation = [
    { name: t('sidebar.dashboard'), href: "/dashboard", icon: LayoutDashboard },
    {
      name: t('sidebar.orderManagement'),
      href: "/dashboard/orders",
      icon: ShoppingBag,
      hasSubmenu: true,
      submenu: [
        {
          name: t('sidebar.repair'),
          href: "/dashboard/orders/repairs",
          icon: Wrench,
          unreadKey: "repair_unread",
        },
        {
          name: t('sidebar.newPhone'),
          href: "/dashboard/orders/phones",
          icon: Smartphone,
          unreadKey: "phone_unread",
        },
        {
          name: t('sidebar.accessories'),
          href: "/dashboard/orders/accessories",
          icon: Package,
          unreadKey: "acceessories_unread",
        },
      ],
    },
    { name: t('sidebar.users'), href: "/dashboard/users", icon: Users },
    { name: t('sidebar.contacts'), href: "/dashboard/contacts", icon: MessageSquare },
    {
      name: t('sidebar.repairServices'),
      href: "/dashboard/repair-services",
      icon: Wrench,
      hasSubmenu: true,
      submenu: [
        { name: t('sidebar.brands'), href: "/dashboard/repair-services/brands", icon: Tag },
        {
          name: t('sidebar.models'),
          href: "/dashboard/repair-services/models",
          icon: PhoneIcon,
        },
        {
          name: t('sidebar.problems'),
          href: "/dashboard/repair-services/problems",
          icon: List,
        },
      ],
    },
    {
      name: t('sidebar.newPhones'),
      href: "/dashboard/new-phones",
      icon: Smartphone,
      hasSubmenu: true,
      submenu: [
        { name: t('sidebar.brands'), href: "/dashboard/new-phones/brands", icon: Tag },
        { name: t('sidebar.models'), href: "/dashboard/new-phones/models", icon: PhoneIcon },
        { name: t('sidebar.colors'), href: "/dashboard/new-phones/colors", icon: Palette },
      ],
    },
    { name: t('sidebar.accessories'), href: "/dashboard/accessories", icon: Package },
    {
      name: t('sidebar.globalDiscount'),
      href: "/dashboard/global-discount",
      icon: Percent,
    },
  ];

  // Fetch statistics to get unread counts
  const { data: ordersData } = useApiGet(
    ["dashboardStatistics"],
    () => apiFetcher.get("/api/admin/orders/"),
    {
      refetchInterval: 60000, // Refetch every 60 seconds
    }
  );

  const statistics = ordersData?.statistics || {};

  const toggleSubmenu = (menuName) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const handleLogout = async () => {
    try {
      toast.loading(t('sidebar.loggingOut'));
      await logout();
      toast.success(t('sidebar.loggedOutSuccessfully'));
      router.push("/login");
    } catch (error) {
      toast.error(t('sidebar.logoutFailed'));
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-white
          "
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          z-50 w-64 shadow-lg transform transition-transform duration-300 ease-in-out bg-white
          ${
            sidebarOpen
              ? "translate-x-0 fixed inset-y-0 left-0"
              : "-translate-x-full fixed inset-y-0 left-0"
          }
          lg:translate-x-0 lg:relative lg:inset-auto
          flex flex-col 
        `}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-secondary flex-shrink-0">
          <p className="text-lg font-semibold text-accent">{t('sidebar.adminPanel')}</p>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Menu */}
        <nav className="flex-1 overflow-y-auto px-4 pt-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.submenu &&
                  item.submenu.some((sub) => pathname === sub.href)) ||
                (item.hasSubmenu && pathname.startsWith(item.href + "/"));
              const isExpanded = expandedMenus.includes(item.name) || isActive;

              return (
                <li key={item.name}>
                  {item.hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`
                          w-full flex text-black items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                          ${
                            isActive
                              ? "bg-blue-50 text-black border-l-2 border-primary"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </div>
                        <div className="transition-transform duration-200">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </button>

                      {/* Submenu */}
                      <div
                        className={`
                          overflow-hidden transition-all duration-300 ease-in-out
                          ${
                            isExpanded
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }
                        `}
                      >
                        <ul className="ml-6 mt-2 space-y-1">
                          {item.submenu.map((subItem, index) => {
                            const isSubActive = pathname === subItem.href;
                            const unreadCount = subItem.unreadKey
                              ? statistics[subItem.unreadKey] || 0
                              : 0;
                            return (
                              <li
                                key={subItem.name}
                                className={`
                                  transition-all duration-300 ease-in-out
                                  ${
                                    isExpanded
                                      ? "translate-x-0 opacity-100"
                                      : "-translate-x-4 opacity-0"
                                  }
                                `}
                                style={{
                                  transitionDelay: isExpanded
                                    ? `${index * 50}ms`
                                    : "0ms",
                                }}
                              >
                                <Link
                                  href={subItem.href}
                                  className={`
                                    flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                                    ${
                                      isSubActive
                                        ? "bg-blue-50 text-accent border-l-2 border-primary"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                  `}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <div className="flex items-center">
                                    <subItem.icon className="mr-3 h-4 w-4" />
                                    {subItem.name}
                                  </div>
                                  {unreadCount > 0 && (
                                    <span className="ml-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                                      {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                        ${
                          isActive
                            ? "bg-blue-50 text-accent border-r-2 border-primary"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Home and Logout Buttons */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 space-y-2">
          <Link
            href="/"
            className="w-full cursor-pointer flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
          >
            <Home className="mr-3 h-5 w-5" />
            {t('sidebar.home')}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full cursor-pointer flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t('sidebar.logout')}
          </button>
        </div>
      </div>
    </>
  );
}
