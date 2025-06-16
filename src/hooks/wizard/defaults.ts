
import type { Role, ProjectType, WizardStateData } from "./types";

export const defaultIdea = "Lo-Fi Night Drive EP";

export const defaultRole = (roleName: string, percent: number, walletAddress = ""): Role => ({
  roleName,
  walletAddress,
  percent,
  percentNum: percent,
  percentStr: percent.toString(),
  isFixed: false,
});

export const getDefaultRoles = (type: ProjectType): Role[] => {
  switch(type) {
    case "Music": return [defaultRole("Artist", 70), defaultRole("Producer", 30)];
    case "Film": return [defaultRole("Director", 60), defaultRole("Producer", 30), defaultRole("DP", 10)];
    case "Fashion": return [defaultRole("Designer", 70), defaultRole("Producer", 30)];
    case "Art": return [defaultRole("Artist", 100)];
    default: return [defaultRole("Creator", 100)];
  }
};

export const getInitialWizardState = (): WizardStateData => ({
  step: 1,
  projectIdea: defaultIdea,
  projectType: "Music",
  mode: "team",
  roles: [defaultRole("Artist", 70), defaultRole("Producer", 30)],
  editingRoleIdx: null,
  expenses: [],
  editingExpenseIdx: null,
  pledgeUSDC: "",
  walletAddress: null,
  isWizardOpen: false,
  coverBase64: null,
  doAdvancedToken: false,
  tokenCustomization: undefined,
});
