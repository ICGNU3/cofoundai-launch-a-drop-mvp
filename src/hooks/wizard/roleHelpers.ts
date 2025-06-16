import type { Role } from "./types";

// Enhanced auto-rebalance helper function with epsilon tolerance
export const rebalanceRoles = (roles: Role[], changedRoleIdx?: number): Role[] => {
  const epsilon = 0.1;
  const sum = roles.reduce((s, r) => s + r.percentNum, 0);
  
  // If we're within epsilon of 100, consider it balanced
  if (Math.abs(sum - 100) < epsilon) {
    return roles.map(r => ({ 
      ...r, 
      percent: r.percentNum,
      percentStr: r.percentNum.toString()
    }));
  }

  const difference = 100 - sum;
  const changedRole = changedRoleIdx !== undefined ? roles[changedRoleIdx] : null;
  const otherRoles = roles.filter((_, i) => i !== changedRoleIdx && roles[i].percentNum > 0);
  const otherSum = otherRoles.reduce((s, r) => s + r.percentNum, 0);

  if (otherSum === 0 || otherRoles.length === 0) {
    // If no other roles to distribute to, keep as is
    return roles.map(r => ({ 
      ...r, 
      percent: r.percentNum,
      percentStr: r.percentNum.toString()
    }));
  }

  // Distribute difference proportionally across other roles
  const rebalanced = roles.map((role, i) => {
    if (i === changedRoleIdx || role.percentNum === 0) {
      return { 
        ...role, 
        percent: role.percentNum,
        percentStr: role.percentNum.toString()
      };
    }
    
    const proportion = role.percentNum / otherSum;
    const adjustment = difference * proportion;
    const newPercent = Math.max(0, Math.min(100, role.percentNum + adjustment));
    const roundedPercent = Math.round(newPercent * 10) / 10;
    
    return {
      ...role,
      percentNum: roundedPercent,
      percentStr: roundedPercent.toString(),
      percent: roundedPercent
    };
  });

  // Final adjustment to ensure exactly 100%
  const finalSum = rebalanced.reduce((s, r) => s + r.percentNum, 0);
  const finalDiff = 100 - finalSum;
  
  if (Math.abs(finalDiff) > epsilon) {
    // Distribute remaining difference to first few adjustable roles
    let remaining = finalDiff;
    for (let i = 0; i < rebalanced.length && Math.abs(remaining) > epsilon; i++) {
      if (i !== changedRoleIdx && rebalanced[i].percentNum > 0) {
        const adjustment = remaining > 0 ? Math.min(1, remaining) : Math.max(-1, remaining);
        rebalanced[i].percentNum = Math.max(0, Math.min(100, rebalanced[i].percentNum + adjustment));
        rebalanced[i].percentStr = rebalanced[i].percentNum.toString();
        rebalanced[i].percent = rebalanced[i].percentNum;
        remaining -= adjustment;
      }
    }
  }

  return rebalanced;
};
