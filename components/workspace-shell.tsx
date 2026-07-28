"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowSquareOut,
  CirclesThreePlus,
  FileText,
  Package,
  SignOut,
  SquaresFour,
} from "@/components/icons";
import type { DemoUser } from "@/lib/types";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "/workspace", icon: SquaresFour, exact: true },
  { label: "Products", href: "/workspace/products", icon: Package },
  { label: "Documents", href: "/workspace/documents", icon: FileText },
  { label: "Passport", href: "/passport/OR-24017", icon: CirclesThreePlus, external: true },
];

export function WorkspaceShell({ children, user }: { children: React.ReactNode; user: DemoUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="workspace-shell">
      <a href="#workspace-main" className="skip-link">
        Skip to workspace content
      </a>
      <aside className="workspace-sidebar">
        <div className="workspace-switcher">
          <span className="workspace-switcher__mark">NL</span>
          <span>
            <strong>Northline Studio</strong>
            <small>Demo workspace</small>
          </span>
        </div>
        <nav className="workspace-nav" aria-label="Workspace navigation">
          <p className="workspace-nav__label">Workspace</p>
          {navigation.map(({ label, href, icon: Icon, exact, external }) => (
            <Link
              key={href}
              href={href}
              className={cn("workspace-nav__item", isActive(href, exact) && "is-active")}
              target={external ? "_blank" : undefined}
            >
              <Icon size={20} weight={isActive(href, exact) ? "fill" : "regular"} aria-hidden="true" />
              <span>{label}</span>
              {external && <ArrowSquareOut className="workspace-nav__external" size={14} aria-hidden="true" />}
            </Link>
          ))}
        </nav>
        <div className="workspace-sidebar__footer">
          <div className="demo-user">
            <span className="avatar">{user.initials}</span>
            <span>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </span>
          </div>
          <button className="sidebar-signout" onClick={signOut} type="button" aria-label="Sign out">
            <SignOut size={19} aria-hidden="true" />
          </button>
        </div>
      </aside>

      <header className="workspace-mobile-header">
        <span className="avatar">{user.initials}</span>
      </header>

      <main id="workspace-main" className="workspace-main" tabIndex={-1}>
        {children}
      </main>

      <nav className="workspace-bottom-nav" aria-label="Mobile workspace navigation">
        {navigation.map(({ label, href, icon: Icon, exact }) => (
          <Link key={href} href={href} className={cn(isActive(href, exact) && "is-active")}>
            <Icon size={22} weight={isActive(href, exact) ? "fill" : "regular"} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
