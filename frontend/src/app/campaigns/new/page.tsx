"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampaign } from "@/lib/api";
import { ArrowLeft, Plus, X, Briefcase, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewCampaignPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
    }
    setSkillInput("");
  };

  const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !role.trim()) {
      setError("Title and Role are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const campaign = await createCampaign({ title, role, description, required_skills: skills });
      router.push(`/campaigns/${campaign.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Failed to create campaign.");
      setLoading(false);
    }
  };

  const suggestedSkills: Record<string, string[]> = {
    "AI Engineer": ["Python", "FastAPI", "LLMs", "Vector Databases", "Machine Learning", "LangChain"],
    "Frontend Dev": ["React", "TypeScript", "Next.js", "CSS", "REST APIs"],
    "Backend Dev": ["Python", "Node.js", "PostgreSQL", "Redis", "Docker", "FastAPI"],
    "DevOps": ["Kubernetes", "Docker", "CI/CD", "AWS", "Terraform"],
  };

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8 slide-up">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors w-fit">
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-widest">New Campaign</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Create Hiring Campaign</h1>
        <p className="text-white/40 text-sm mt-1">Define the role requirements to power AI candidate matching</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 slide-up" style={{ animationDelay: "0.05s" }}>
        {/* Campaign Title */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-[13px] font-semibold text-white/60 uppercase tracking-wider">Campaign Details</h2>

          <div>
            <label className="block text-[13px] text-white/60 mb-2 font-medium">Campaign Title *</label>
            <input
              className="input-field"
              placeholder="e.g. AI Engineer — Batch 1 (June 2026)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[13px] text-white/60 mb-2 font-medium">Target Job Role *</label>
            <input
              className="input-field"
              placeholder="e.g. Senior AI Engineer"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[13px] text-white/60 mb-2 font-medium">Job Description</label>
            <textarea
              className="input-field resize-none"
              rows={4}
              placeholder="Describe the role, responsibilities, and requirements..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Required Skills */}
        <div className="glass-card p-6 space-y-4">
          <div>
            <h2 className="text-[13px] font-semibold text-white/60 uppercase tracking-wider mb-1">Required Skills</h2>
            <p className="text-[12px] text-white/30">AI will use these to score and rank candidates</p>
          </div>

          {/* Quick add presets */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(suggestedSkills).map(preset => (
              <button key={preset} type="button"
                onClick={() => setSkills([...new Set([...skills, ...suggestedSkills[preset]])])}
                className="text-[11px] px-3 py-1.5 rounded-lg text-white/40 hover:text-violet-300 transition-colors"
                style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.15)" }}>
                + {preset}
              </button>
            ))}
          </div>

          {/* Skill input */}
          <div className="flex gap-2">
            <input
              className="input-field flex-1"
              placeholder="Add a skill (press Enter)"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="button" onClick={addSkill} className="btn-secondary px-4">
              <Plus size={15} />
            </button>
          </div>

          {/* Skills list */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill}
                  className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg text-violet-300"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}
                    className="text-violet-400/60 hover:text-violet-200 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl px-4 py-3 text-[13px] text-red-300"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1 justify-center py-3" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Campaign...
              </span>
            ) : (
              <>
                <Briefcase size={16} />
                Create Campaign
              </>
            )}
          </button>
          <Link href="/" className="btn-secondary py-3 px-6">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
