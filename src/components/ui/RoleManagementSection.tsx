
import React from "react";
import { PercentBar } from "./PercentBar";
import { RolesList } from "./RolesList";
import { RolePercentageStatus } from "./RolePercentageStatus";
import type { Role } from "@/hooks/useWizardState";

type RoleManagementSectionProps = {
  roles: Role[];
  onEditRole: (idx: number) => void;
  onRemoveRole: (idx: number) => void;
  onAddRole: () => void;
  onUpdateRolePercent?: (idx: number, newPercent: number) => void;
};

export const RoleManagementSection: React.FC<RoleManagementSectionProps> = ({
  roles,
  onEditRole,
  onRemoveRole,
  onAddRole,
  onUpdateRolePercent,
}) => {
  const sumPercent = roles.reduce((sum, r) => sum + (r.percentNum || r.percent), 0);

  return (
    <>
      <PercentBar used={sumPercent} />
      
      <RolesList
        roles={roles}
        onEditRole={onEditRole}
        onRemoveRole={onRemoveRole}
        onAddRole={onAddRole}
        onUpdateRolePercent={onUpdateRolePercent}
      />

      <RolePercentageStatus sumPercent={sumPercent} />
    </>
  );
};
