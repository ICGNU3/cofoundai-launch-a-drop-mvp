
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
};

export const RoleManagementSection: React.FC<RoleManagementSectionProps> = ({
  roles,
  onEditRole,
  onRemoveRole,
  onAddRole,
}) => {
  const sumPercent = roles.reduce((sum, r) => sum + r.percent, 0);

  return (
    <>
      <PercentBar used={sumPercent} />
      
      <RolesList
        roles={roles}
        onEditRole={onEditRole}
        onRemoveRole={onRemoveRole}
        onAddRole={onAddRole}
      />

      <RolePercentageStatus sumPercent={sumPercent} />
    </>
  );
};
