"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/brand-logo";

const links = [
  { label: "Why Orin", href: "#why-orin" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Product", href: "#product" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="marketing-header">
      <div className="marketing-header__inner">
        <Link href="/" aria-label="Orin home" className="marketing-brand-link">
          <BrandLogo priority />
        </Link>

        <nav className="marketing-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="marketing-header__actions">
          <Link className="header-sign-in" href="/login">
            Sign in
          </Link>
          <Link className="button-link button-link--primary" href="/login">
            Explore the demo
          </Link>
        </div>

        <button
          className="marketing-menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="marketing-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <List size={24} />}
        </button>
      </div>

      <div
        id="marketing-mobile-menu"
        className={`marketing-mobile-menu ${open ? "is-open" : ""}`}
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <Link href="/login" onClick={() => setOpen(false)}>
          Sign in
        </Link>
        <Link className="button-link button-link--primary" href="/login" onClick={() => setOpen(false)}>
          Explore the demo
        </Link>
      </div>
    </header>
  );
}
