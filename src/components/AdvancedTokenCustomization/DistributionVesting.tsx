
import React from "react";
type Distribution = {
  team: number;
  treasury: number;
  publicSale: number;
};
type Vesting = {
  team: number; // months
  early: number; // months
};
type Props = {
  distribution: Distribution;
  onChange: (d: Distribution) => void;
  vesting: Vesting;
  onChangeVesting: (v: Vesting) => void;
  onNext: () => void;
  onBack: () => void;
};

export const DistributionVesting: React.FC<Props> = ({
  distribution, onChange,
  vesting, onChangeVesting,
  onNext, onBack
}) => {
  const total = distribution.team + distribution.treasury + distribution.publicSale;
  return (
    <div>
      <h2 className="section-heading mb-2">4. Initial Distribution &amp; Vesting</h2>
      <div className="text-tagline mb-3 text-[15px]">
        <b>Initial Distribution:</b> How tokens are allocated at genesis. Should sum to 100%.<br />
        <b>Vesting:</b> Vesting helps protect projects from dumping by locking team rewards over time.<br />
        <span className="text-gold">Example:</span> Team 20% (12mo), Treasury 30%, Public Sale 50%
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex gap-2 items-center">
          <span className="w-24">Team %</span>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            className="p-2 rounded border border-border bg-card text-body-text w-24"
            value={distribution.team}
            onChange={e => onChange({ ...distribution, team: Number(e.target.value) })}
          />
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-24">Treasury %</span>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            className="p-2 rounded border border-border bg-card text-body-text w-24"
            value={distribution.treasury}
            onChange={e => onChange({ ...distribution, treasury: Number(e.target.value) })}
          />
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-24">Public Sale %</span>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            className="p-2 rounded border border-border bg-card text-body-text w-24"
            value={distribution.publicSale}
            onChange={e => onChange({ ...distribution, publicSale: Number(e.target.value) })}
          />
        </div>
        <div className="text-xs text-tagline mt-1">
          Total: {total}% {total !== 100 && <span className="text-red-500"> (Must add up to 100%)</span>}
        </div>
      </div>
      <div className="my-2">
        <b>Vesting Schedule (months):</b>
        <div className="flex gap-4 mt-2">
          <label>
            Team:
            <input
              type="number"
              min={0}
              max={48}
              className="ml-2 p-1 rounded border border-border bg-card text-body-text w-20"
              value={vesting.team}
              onChange={e => onChangeVesting({ ...vesting, team: Number(e.target.value) })}
            />
            <span className="ml-1 text-xs text-tagline">months</span>
          </label>
          <label>
            Early Contributors:
            <input
              type="number"
              min={0}
              max={24}
              className="ml-2 p-1 rounded border border-border bg-card text-body-text w-20"
              value={vesting.early}
              onChange={e => onChangeVesting({ ...vesting, early: Number(e.target.value) })}
            />
            <span className="ml-1 text-xs text-tagline">months</span>
          </label>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button className="accent-btn secondary" onClick={onBack}>← Back</button>
        <button className="accent-btn" onClick={onNext} disabled={total !== 100}>Next: Utility</button>
      </div>
    </div>
  );
};
