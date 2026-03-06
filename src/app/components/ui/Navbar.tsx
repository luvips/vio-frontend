"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("q") ?? "");
  const previousRouteRef = useRef<string | null>(null);

  useEffect(() => {
    setTerm(searchParams.get("q") ?? "");
  }, [searchParams]);

  function navigateSearch(rawValue: string) {
    const trimmed = rawValue.trim();

    if (!trimmed) {
      const fallbackRoute = previousRouteRef.current ?? "/";
      previousRouteRef.current = null;
      router.replace(fallbackRoute);
      return;
    }

    if (!previousRouteRef.current && pathname !== "/buscar") {
      const currentParams = searchParams.toString();
      previousRouteRef.current = currentParams ? `${pathname}?${currentParams}` : pathname;
    }

    const params = new URLSearchParams();
    params.set("q", trimmed);
    params.set("page", "1");
    router.replace(`/buscar?${params.toString()}`);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateSearch(term);
  }

  return (
    <header style={{ background: "#000" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 flex-shrink-0">
          <span
            className="font-black text-2xl px-2 py-0.5 text-black tracking-tighter"
            style={{ background: "#ffbd3f" }}
          >
            G
          </span>
          <span className="font-black text-2xl text-white tracking-tighter px-1">
            ALI
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-black tracking-widest">
          {[
            { label: "PELICULAS", href: "/" },
            { label: "TOP RATED", href: "/top-rated" },
            { label: "ESTRENOS", href: "/estrenos" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="transition-colors"
              style={{ color: "#aaa" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#ffbd3f")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#aaa")}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <form className="relative hidden sm:block" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Buscar..."
            className="text-xs font-semibold px-4 py-2.5 pr-9 outline-none w-44 focus:w-60 transition-all duration-200"
            value={term}
            onChange={(event) => {
              const value = event.target.value;
              setTerm(value);
              navigateSearch(value);
            }}
            style={{
              background: "#1a1a1a",
              color: "#fff",
              border: "2px solid #333",
            }}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Buscar">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>

      </div>

      {/* Color strip */}
      <div className="flex h-1.5">
        {["#e53935","#ff6d00","#43a047","#00acc1","#3949ab","#e91e8c","#8e24aa","#795548","#9e9e9e"].map((c) => (
          <div key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>
    </header>
  );
}
