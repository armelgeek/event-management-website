"use client";

import { NavLink } from "@/shared/components/atoms/ui/navigation";
import { Button } from "@/shared/components/atoms/ui/button";
import { useAuth } from "@/shared/providers/auth-provider";
import Link from "next/link";
import { useActivePath } from "./use-active-path";
import { authClient } from "@/shared/lib/config/auth-client";
import { CLIENT_MENU_ITEMS } from "@/shared/lib/constants/app.constant";
import { Logo } from "@/shared/components/atoms/ui/logo";
import { useState } from "react";



const AppClientMenu = () => {
  const { isLoading } = useAuth();
  const { data } = authClient.useSession();
  const session = data?.session;
  const pathname = useActivePath();
  const [mobileOpen, setMobileOpen] = useState(false);

  const ctaButton = () => {
    if (isLoading) {
      return <div className="h-10 w-36 bg-gradient-to-r from-primary to-primary-dark rounded-full animate-pulse shadow-lg" />;
    }
    const baseClass =
      "w-full rounded-full px-6 py-2 font-bold text-white bg-gradient-to-r from-primary to-primary-dark shadow-lg hover:from-primary-dark hover:to-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-150";
    if (session) {
      return (
        <Button asChild className={baseClass} style={{ minWidth: 140 }}>
          <Link href="/dashboard">Tableau de bord</Link>
        </Button>
      );
    }
    return (
      <Button asChild className={baseClass} style={{ minWidth: 140 }}>
        <Link href="/register">Créer un compte</Link>
      </Button>
    );
  };

  return (
    <nav
      className="w-full sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm px-2 sm:px-8 md:px-16 lg:px-32 h-16 flex items-center"
      aria-label="Menu principal"
      role="navigation"
    >
      {/* Logo left */}
      <div className="flex items-center min-w-[120px]">
        <Link href="/" aria-label="Accueil" className="flex items-center gap-2">
          <Logo size="md" variant="compact" />
        </Link>
      </div>

      {/* Nav center */}
      <div className="hidden md:flex flex-1 justify-start items-center gap-1">
        {CLIENT_MENU_ITEMS.map((item) => (
          <NavLink
            key={item.url}
            href={item.url}
            className="flex items-center gap-2 font-semibold py-2 px-4  transition-colors duration-150 hover:text-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-base"
            active={item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)}
            aria-current={item.url === pathname ? "page" : undefined}
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            {item.title}
          </NavLink>
        ))}
      </div>

      {/* Actions right */}
      <div className="flex items-center gap-2 min-w-[120px] justify-end">
        <div className="hidden md:block w-36">{ctaButton()}</div>
        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile slide-in menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            className="absolute top-0 right-0 w-72 max-w-[90vw] h-full bg-white shadow-xl flex flex-col p-6 gap-4 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
            role="menu"
            aria-label="Menu mobile"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between mb-4">
              <Logo size="sm" variant="compact" />
              <button
                className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Fermer le menu"
                onClick={() => setMobileOpen(false)}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-2" aria-label="Navigation mobile">
              {CLIENT_MENU_ITEMS.map((item) => (
                <div key={item.url} onClick={() => setMobileOpen(false)}>
                  <NavLink
                    href={item.url}
                    className="flex items-center gap-2 font-semibold py-2 px-4 rounded-full transition-colors duration-150 hover:text-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-base"
                    active={item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)}
                    aria-current={item.url === pathname ? "page" : undefined}
                  >
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    {item.title}
                  </NavLink>
                </div>
              ))}
            </nav>
            <div className="mt-6 w-full">{ctaButton()}</div>
          </aside>
        </div>
      )}
    </nav>
  );
};

export default AppClientMenu;
