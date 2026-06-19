"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCampaigns, Campaign } from "@/lib/api";
import {
  Briefcase, Plus, Users, Clock,
  TrendingUp, ArrowRight, Sparkles, Upload
} from "lucide-react";

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns()
      .then(setCampaigns)
      .finally(() => setLoading(false));
  }, []);

  const totalCampaigns = campaigns.length;
  const totalActive = campaigns.filter(c => c.status === "active").length;

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 slide-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-violet-400" />
            <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">
              AI Recruitment Platform
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Manage your hiring campaigns and candidate pipeline</p>
        </div>
        <Link href="/campaigns/new" className="btn-primary">
          <Plus size={16} />
          New Campaign
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8 slide-up" style={{ animationDelay: "0.05s" }}>
        {[
          { label: "Total Campaigns", value: totalCampaigns, icon: Briefcase, color: "#7c3aed" },
          { label: "Active Campaigns", value: totalActive, icon: TrendingUp, color: "#06b6d4" },
          { label: "Processing", value: "—", icon: Clock, color: "#f59e0b" },
          { label: "Candidates Found", value: "—", icon: Users, color: "#10b981" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-white/40 font-medium">{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}20` }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Campaigns</h2>
          <Link href="/campaigns" className="text-[13px] text-violet-400 hover:text-violet-300 transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-6 h-48 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-3/4 mb-3" />
                <div className="h-3 bg-white/5 rounded w-1/2 mb-6" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 bg-white/5 rounded-full w-16" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {campaigns.map((c, i) => (
              <CampaignCard key={c.id} campaign={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignCard({ campaign, index }: { campaign: Campaign; index: number }) {
  return (
    <Link href={`/campaigns/${campaign.id}`}
      className="glass-card p-6 group block slide-up"
      style={{ animationDelay: `${0.05 * index}s` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${campaign.status === "active" ? "bg-emerald-400" : "bg-white/20"}`} />
            <span className="text-[11px] text-white/30 uppercase tracking-widest font-medium">
              {campaign.status}
            </span>
          </div>
          <h3 className="font-semibold text-white text-[15px] truncate group-hover:text-violet-300 transition-colors">
            {campaign.title}
          </h3>
          <p className="text-[13px] text-white/40 mt-0.5">{campaign.role}</p>
        </div>
        <ArrowRight size={16} className="text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
      </div>

      {/* Skills */}
      {campaign.required_skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {campaign.required_skills.slice(0, 4).map(skill => (
            <span key={skill}
              className="text-[11px] px-2 py-0.5 rounded-md text-white/50"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              {skill}
            </span>
          ))}
          {campaign.required_skills.length > 4 && (
            <span className="text-[11px] px-2 py-0.5 rounded-md text-white/30"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              +{campaign.required_skills.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-[12px] text-white/25">
          {new Date(campaign.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-violet-400">
          <Upload size={12} />
          Upload Resumes
        </span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="glass-card p-16 text-center">
      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
        <Briefcase size={28} className="text-violet-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No campaigns yet</h3>
      <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
        Create your first hiring campaign to start uploading and analyzing resumes with AI.
      </p>
      <Link href="/campaigns/new" className="btn-primary">
        <Plus size={16} />
        Create First Campaign
      </Link>
    </div>
  );
}
