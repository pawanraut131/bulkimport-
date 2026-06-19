"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Upload,
  Zap,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/campaigns", icon: Briefcase, label: "Campaigns" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-50"
      style={{
        background: "rgba(10, 11, 15, 0.95)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}>

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-[15px] leading-none">ResumeAI</div>
            <div className="text-[11px] text-white/30 mt-0.5">Bulk Processing</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
          Main
        </div>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-violet-600/15 text-violet-300 border border-violet-500/20"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}>
              <Icon size={16} className={active ? "text-violet-400" : ""} />
              {label}
            </Link>
          );
        })}

        <div className="px-3 py-2 mt-4 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
          Quick Actions
        </div>
        <Link href="/campaigns/new"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200">
          <Upload size={16} />
          New Campaign
        </Link>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] text-white/30">System operational</span>
        </div>
        <a href="http://localhost:5555" target="_blank" rel="noopener noreferrer"
          className="mt-2 text-[11px] text-violet-400/60 hover:text-violet-400 transition-colors block">
          → Flower Dashboard
        </a>
      </div>
    </aside>
  );
}
