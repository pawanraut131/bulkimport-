"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCampaigns, deleteCampaign, Campaign } from "@/lib/api";
import {
  Plus, Briefcase, ArrowRight, Trash2, MoreHorizontal,
  Search, Sparkles, Filter
} from "lucide-react";
import clsx from "clsx";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    getCampaigns().then(setCampaigns).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign and all its candidates?")) return;
    await deleteCampaign(id);
    setCampaigns(c => c.filter(x => x.id !== id));
    setMenuOpen(null);
  };

  const filtered = campaigns.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper-full" style={{ paddingTop: "48px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 slide-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-widest">Recruitment</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Campaigns</h1>
          <p className="text-white/40 text-sm mt-1">{campaigns.length} active hiring campaign{campaigns.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/campaigns/new" className="btn-primary">
          <Plus size={16} />
          New Campaign
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md slide-up" style={{ animationDelay: "0.05s" }}>
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          className="input-field pl-10"
          placeholder="Search campaigns..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Campaign list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-28 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <Briefcase size={24} className="text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {search ? "No campaigns match your search" : "No campaigns yet"}
          </h3>
          <p className="text-white/40 text-sm mb-6">
            {search ? "Try a different keyword" : "Create your first campaign to get started"}
          </p>
          {!search && (
            <Link href="/campaigns/new" className="btn-primary">
              <Plus size={16} /> Create Campaign
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <div key={c.id}
              className="glass-card p-5 flex items-center gap-5 group slide-up"
              style={{ animationDelay: `${0.04 * i}s` }}>
              {/* Status dot + icon */}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.18)" }}>
                <Briefcase size={18} className="text-violet-400" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    c.status === "active" ? "bg-emerald-400" : "bg-white/20"
                  )} />
                  <Link href={`/campaigns/${c.id}`}
                    className="font-semibold text-[15px] text-white truncate hover:text-violet-300 transition-colors">
                    {c.title}
                  </Link>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[13px] text-white/40">{c.role}</span>
                  <span className="text-white/15">•</span>
                  <span className="text-[12px] text-white/25">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Skills preview */}
              <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0 max-w-xs">
                {c.required_skills.slice(0, 3).map(s => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded text-white/40"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    {s}
                  </span>
                ))}
                {c.required_skills.length > 3 && (
                  <span className="text-[11px] text-white/25">+{c.required_skills.length - 3}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/campaigns/${c.id}`}
                  className="flex items-center gap-1.5 text-[13px] text-violet-400 hover:text-violet-300 transition-colors opacity-0 group-hover:opacity-100">
                  Open <ArrowRight size={13} />
                </Link>

                <div className="relative">
                  <button onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors">
                    <MoreHorizontal size={15} />
                  </button>
                  {menuOpen === c.id && (
                    <div className="absolute right-0 top-full mt-1 z-20 rounded-xl overflow-hidden shadow-2xl"
                      style={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.1)", minWidth: "140px" }}>
                      <Link href={`/campaigns/${c.id}`}
                        className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                        <ArrowRight size={13} /> Open
                      </Link>
                      <button onClick={() => handleDelete(c.id)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
