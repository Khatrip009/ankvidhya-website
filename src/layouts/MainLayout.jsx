import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";

const navigation = [
  { label: "Home", path: "/" },
  { label: "School Partnership", path: "/school-partnership" },
  { label: "Our Centers", path: "/center" },
  { label: "Online Courses", path: "/online-courses" },
  { label: "Founder", path: "/founder" },
  { label: "Contact", path: "/contact" },
];

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB1D2D] ${
    isActive
      ? "bg-red-50 text-[#DB1D2D]"
      : "text-slate-600 hover:bg-slate-50 hover:text-[#182131]"
  }`;

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-white text-[#182131]">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-white px-4 py-3 text-sm font-bold text-[#182131] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur">
        <div className="hidden bg-[#182131] text-white sm:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 text-[11px] lg:px-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <a href="tel:+916357785778" className="inline-flex items-center gap-2 hover:text-[#E7C77D]">
                <Phone size={13} /> +91 63 5778 5778
              </a>
              <a href="mailto:info@ankvidhya.com" className="inline-flex items-center gap-2 hover:text-[#E7C77D]">
                <Mail size={13} /> info@ankvidhya.com
              </a>
            </div>
            <span className="font-semibold tracking-wide text-[#E7C77D]">MAKING MATH GENIUS</span>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-8">
          <Link to="/" className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB1D2D]" aria-label="Ankvidhya home">
            <img
              src="/Ank_Logo.png"
              alt="Ankvidhya — Making Math Genius"
              width="2048"
              height="576"
              fetchPriority="high"
              className="h-11 w-auto max-w-[170px] object-contain sm:h-12 sm:max-w-[190px]"
            />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
            {navigation.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === "/"} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <Link
              to="/contact#contact-form"
              className="hidden min-h-11 items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-4 py-3 text-xs font-bold text-white transition hover:bg-red-700 sm:inline-flex"
            >
              Enquire Now <ArrowUpRight size={15} />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#182131] transition hover:border-[#DB1D2D] hover:text-[#DB1D2D] xl:hidden"
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 top-[69px] z-40 bg-[#182131]/40 xl:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="absolute inset-x-0 top-full z-50 border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-xl xl:hidden"
            >
              <div className="mx-auto grid max-w-7xl gap-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold transition ${
                        isActive ? "bg-red-50 text-[#DB1D2D]" : "text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Link
                  to="/contact#contact-form"
                  className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-5 py-3 text-sm font-bold text-white"
                >
                  Enquire Now <ArrowUpRight size={16} />
                </Link>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <a href="tel:+916357785778" className="inline-flex items-center gap-2"><Phone size={14} /> +91 63 5778 5778</a>
                  <a href="mailto:info@ankvidhya.com" className="inline-flex items-center gap-2"><Mail size={14} /> info@ankvidhya.com</a>
                </div>
              </div>
            </nav>
          </>
        )}
      </header>

      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <Link to="/" aria-label="Ankvidhya home" className="inline-block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB1D2D]">
              <img src="/Ank_Logo.png" alt="Ankvidhya" width="2048" height="576" loading="lazy" className="h-12 w-auto max-w-[190px] object-contain" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-7 text-slate-500">
              Making Math Genius. Mathematics for the mind, wisdom for life.
            </p>
            <p className="mt-4 text-xs text-slate-500">Surat, Gujarat, India</p>
          </div>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#182131]">Explore</h2>
            <div className="mt-4 grid gap-3">
              {navigation.slice(0, 3).map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-slate-500 hover:text-[#DB1D2D]">{item.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#182131]">Learn & Partner</h2>
            <div className="mt-4 grid gap-3">
              {navigation.slice(3, 5).map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-slate-500 hover:text-[#DB1D2D]">{item.label}</Link>
              ))}
              <Link to="/contact" className="text-sm text-slate-500 hover:text-[#DB1D2D]">Contact Us</Link>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#182131]">Contact</h2>
            <div className="mt-4 grid gap-3">
              <a href="tel:+916357785778" className="text-sm text-slate-500 hover:text-[#DB1D2D]">+91 63 5778 5778</a>
              <a href="mailto:info@ankvidhya.com" className="break-all text-sm text-slate-500 hover:text-[#DB1D2D]">info@ankvidhya.com</a>
              <Link to="/contact" className="text-sm font-semibold text-[#DB1D2D]">Visit our contact page <ArrowUpRight className="inline" size={14} /></Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center sm:flex-row sm:text-left lg:px-8">
            <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} Ankvidhya. All rights reserved.</p>
            <p className="text-xs font-semibold text-[#182131]">Powered by <span className="text-[#DB1D2D]">QMitra</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
