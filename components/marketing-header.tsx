"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

/**
 * The menu glyphs are inlined rather than imported from `components/icons`.
 * This is the only client component on the marketing page, and importing the
 * shared icon module would pull the whole set into the home page bundle for
 * the sake of two paths.
 */
function MenuIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

function CloseIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  );
}

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
          {open ? <CloseIcon size={22} /> : <MenuIcon size={24} />}
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
