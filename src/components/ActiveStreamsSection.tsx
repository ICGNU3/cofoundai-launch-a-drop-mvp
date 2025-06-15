
import React from "react";

interface Role {
  id: string;
  name: string;
  percent: number;
  stream_flow_rate: number | null;
  stream_active: boolean | null;
  wallet_address: string | null;
}

export const ActiveStreamsSection = ({ activeStreams }: { activeStreams: Role[] }) => {
  if (activeStreams.length === 0) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <h3 className="font-semibold text-body-text mb-4">Active Payment Streams</h3>
      <div className="space-y-3">
        {activeStreams.map((role) => (
          <div key={role.id} className="flex items-center justify-between p-3 bg-background/50 rounded">
            <div>
              <div className="font-medium text-body-text">{role.name}</div>
              <div className="text-sm text-body-text/70">{role.percent}% share</div>
              {role.wallet_address && (
                <div className="text-xs text-body-text/50 break-all">{role.wallet_address}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-green-400 font-mono text-sm">
                {(role.stream_flow_rate || 0).toFixed(6)} USDC/sec
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
