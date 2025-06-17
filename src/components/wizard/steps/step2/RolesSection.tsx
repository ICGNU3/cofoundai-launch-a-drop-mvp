
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

interface Role {
  name: string;
  percent: number;
  percentNum: number;
  percentStr: string;
  address: string;
  isFixed: boolean;
}

interface RolesSectionProps {
  mode: string;
  roles: Role[];
  onAddRole: () => void;
  onEditRole: (index: number) => void;
  onRemoveRole: (index: number) => void;
}

export const RolesSection: React.FC<RolesSectionProps> = ({
  mode,
  roles,
  onAddRole,
  onEditRole,
  onRemoveRole,
}) => {
  if (mode === "solo") {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base flex items-center gap-2 font-inter">
            <Users className="w-4 h-4" />
            Solo Creator Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-tagline font-inter">
            You're creating this project as a solo creator. You'll receive 100% of the revenue.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalPercent = roles.reduce((sum, role) => sum + role.percentNum, 0);

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base flex items-center gap-2 font-inter">
          <Users className="w-4 h-4" />
          Team Roles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-3">
          {roles.map((role, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm font-inter text-headline">{role.name}</div>
                <div className="text-xs text-tagline truncate font-inter">
                  {role.address || "No address set"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium font-inter text-headline">{role.percentNum}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditRole(index)}
                  className="h-8 px-2 font-inter"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveRole(index)}
                  className="h-8 px-2 text-red-600 hover:text-red-700 font-inter"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {totalPercent !== 100 && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded font-inter">
            Total allocation: {totalPercent}% (should be 100%)
          </div>
        )}

        <Button
          variant="outline"
          onClick={onAddRole}
          className="w-full gap-2 font-inter"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </Button>
      </CardContent>
    </Card>
  );
};
