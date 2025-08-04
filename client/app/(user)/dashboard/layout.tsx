"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/shared/providers/auth-provider";
import {
  Home,
  User,
  Calendar,
  Settings,
  LogOut,
  HelpCircle,
  Bell,
  CreditCard,
  Clock,
  FileText,
  Menu,
  X,
  User2Icon
} from "lucide-react";
import { Button } from "@/shared/components/atoms/ui/button";
import { Logo } from "@/shared/components/atoms/ui/logo";
import Image from "next/image";
import { UserNav } from "@/shared/components/molecules/layout/user-nav";
import { useSession } from "@/shared/lib/config/auth-client";

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: User, label: "Profil", href: "/dashboard/profile" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { data } = useSession();
  const user = data?.user;
  const session = data?.session;
  const { logout } = useAuth();
  if (!session || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <nav className="bg-white border-b border-gray-200 shadow-sm relative z-10">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-52">
          <div className="flex justify-between items-center h-16">
            {/* Logo et Menu Mobile */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <Link href="/" className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <Logo size="md" variant="compact" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Mon espace</span>
                  <span className="text-xs text-gray-500 font-medium">Personnel</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <UserNav />
            </div>
          </div>
        </div>
      </nav>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div>
            <div className="flex flex-col items-center gap-2">
              {user && user.image && (
                <Image
                  src={user.image}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40} 
                />
              )}
              {user && user.name && (
                <span className="font-medium">{user.name}</span>
              )}
              {user && user.email && (
                <span className="text-xs text-gray-500 ml-2">{user.email}</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50"
              onClick={logout}
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Déconnexion
            </Button>
          </div>
          <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Home className="w-4 h-4 text-primary" />
                Navigation
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="flex-1 p-4">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <div className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>


          </aside>
        </div>
      )}

      <div className="flex mt-4 sm:mt-6 lg:mt-10 px-4 sm:px-6 lg:px-8 xl:px-52">
        
        <aside className="hidden lg:block w-64 rounded-lg shadow-sm h-fit">
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <User2Icon className="w-4 h-4 text-primary" />
              Compte
            </div>
          </div>

          <div className="p-4 bg-white text-center border border-gray-100 mb-5">
            <div className="flex flex-col items-center gap-2">
              {user && user.image && (
                <Image
                  src={user.image}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40} 
                />
              )}
              {user && user.name && (
                <span className="font-medium">{user.name}</span>
              )}
              {user && user.email && (
                <span className="text-xs text-gray-500 ml-2">{user.email}</span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={logout}
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Déconnexion
            </Button>
          </div>

          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Home className="w-4 h-4 text-primary" />
              Navigation
            </div>
          </div>

          <nav className="p-4  bg-white  border border-gray-100">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    <div className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          
        </aside>

        <main className="flex-1 lg:ml-8 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
