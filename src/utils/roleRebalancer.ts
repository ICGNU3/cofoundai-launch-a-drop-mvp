
import type { Role } from "@/components/RoleAllocationPanel";

/**
 * Proportionally rebalance percentages for roles when one changes.
 * Used for bulk/utility rebalancing, or for AI suggestions.
 */
export function proportionalRebalance(
  roles: Role[],
  changedIdx: number,
  newPercent: number
): Role[] {
  if (roles.length === 1) return [{ ...roles[0], percent: 100 }];
  const delta = newPercent - roles[changedIdx].percent;
  let total = 0;
  roles.forEach((r, i) => {
    if (i !== changedIdx) total += r.percent;
  });
  return roles.map((r, i) => {
    if (i === changedIdx) return { ...r, percent: newPercent };
    if (total === 0) return { ...r, percent: (100 - newPercent) / (roles.length - 1) };
    let prop = r.percent / total;
    let v = Math.max(0, r.percent - prop * delta);
    return { ...r, percent: v };
  });
}
