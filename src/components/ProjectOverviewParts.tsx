
import React from "react";

export function ProjectFundingProgress({ project }: { project: any }) {
  const fundingTotal = typeof project.funding_total === "number" ? project.funding_total : 0;
  const fundingTarget = typeof project.funding_target === "number" ? project.funding_target : 0;
  const percent = fundingTarget > 0 ? Math.min((fundingTotal / fundingTarget) * 100, 100) : 0;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <div className="font-semibold">Funding Status</div>
        <div className="font-mono">
          {fundingTotal.toLocaleString("en", { minimumFractionDigits: 2 })} / {fundingTarget.toLocaleString("en", { minimumFractionDigits: 2 })} USDC
        </div>
      </div>
      <div className="w-full h-3 bg-zinc-800 rounded-full relative mb-2">
        <div
          style={{ width: `${percent}%` }}
          className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
        />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-zinc-100">{percent.toFixed(1)}%</span>
      </div>
      {percent >= 100 && (
        <div className="text-green-400 font-bold text-sm text-center mt-1">Fully Funded!</div>
      )}
    </div>
  );
}

export function ProjectAnalytics({ analytics }: { analytics: any }) {
  if (!analytics) return (
    <div className="text-zinc-400">Analytics: Not yet tracked.</div>
  );
  return (
    <div className="flex gap-6 items-center">
      <div>
        <div className="font-mono text-xl">{analytics.views ?? 0}</div>
        <div className="text-xs text-zinc-500">Views</div>
      </div>
      <div>
        <div className="font-mono text-xl">{analytics.shares ?? 0}</div>
        <div className="text-xs text-zinc-500">Shares</div>
      </div>
    </div>
  );
}

export function ProjectShares({ project }: { project: any }) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="font-semibold mb-1">Share this Project</div>
      <div className="flex gap-2">
        <button
          className="bg-accent text-white rounded px-4 py-2"
          onClick={() =>
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `${project.project_idea}\nCheck out our Drop on Zora!\n${window.location.origin}/project/${project.id}`
            )}`, "_blank")}
        >
          Tweet
        </button>
        <button
          className="bg-zinc-800 text-white rounded px-4 py-2"
          onClick={() => {
            navigator.clipboard.writeText(`${project.project_idea}\nCheck out our Drop: ${window.location.origin}/project/${project.id}`);
            alert("Link copied!");
          }}
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
