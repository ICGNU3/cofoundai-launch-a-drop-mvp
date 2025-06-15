
import React from "react";
type UtilityType = {
  governance: boolean;
  access: boolean;
  staking: boolean;
  custom: string;
};
type Props = {
  utility: UtilityType;
  onChange: (u: UtilityType) => void;
  onNext: () => void;
  onBack: () => void;
};
export const TokenUtility: React.FC<Props> = ({
  utility, onChange, onNext, onBack
}) => (
  <div>
    <h2 className="section-heading mb-2">5. Token Utility &amp; Governance</h2>
    <div className="text-tagline mb-3 text-[15px]">
      <b>What can your token do?</b> This section helps define its utility, even if the feature is not yet deployed.
      <br />
      <span className="text-gold">Examples:</span> voting in DAOs, premium access, staking, rewards...
    </div>
    <div className="flex flex-col gap-2">
      <label>
        <input
          type="checkbox"
          checked={utility.governance}
          onChange={e => onChange({ ...utility, governance: e.target.checked })}
        />
        &nbsp; Governance: Voting rights or proposal power
      </label>
      <label>
        <input
          type="checkbox"
          checked={utility.access}
          onChange={e => onChange({ ...utility, access: e.target.checked })}
        />
        &nbsp; Access: Unlock premium features/content
      </label>
      <label>
        <input
          type="checkbox"
          checked={utility.staking}
          onChange={e => onChange({ ...utility, staking: e.target.checked })}
        />
        &nbsp; Staking: Earn rewards by holding
      </label>
      <input
        className="p-2 rounded border border-border bg-card text-body-text mt-2"
        placeholder="Other utility (describe in one sentence)"
        value={utility.custom}
        onChange={e => onChange({ ...utility, custom: e.target.value })}
        maxLength={80}
      />
    </div>
    <div className="flex justify-between mt-4">
      <button className="accent-btn secondary" onClick={onBack}>← Back</button>
      <button className="accent-btn" onClick={onNext}>Next: Review &amp; Preview</button>
    </div>
  </div>
);
