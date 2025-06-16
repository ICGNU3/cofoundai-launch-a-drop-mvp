
export type PayoutType = "immediate" | "uponOutcome";
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;
export type ProjectMode = "solo" | "team";
export type ProjectType = "Music" | "Film" | "Fashion" | "Art" | "Other";

export interface Role {
  roleName: string;
  walletAddress: string;
  percent: number; // Keep for backward compatibility
  percentNum: number; // For calculations
  percentStr: string; // For input display
  isFixed: false;
  description?: string;
  skills?: string[];
}

export interface Expense {
  expenseName: string;
  vendorWallet: string;
  amountUSDC: number;
  isFixed: true;
  payoutType: PayoutType;
}

export interface WizardStateData {
  step: WizardStep;
  projectIdea: string;
  projectType: ProjectType;
  mode: ProjectMode;
  roles: Role[];
  editingRoleIdx: number | null;
  expenses: Expense[];
  editingExpenseIdx: number | null;
  pledgeUSDC: string;
  walletAddress: string | null;
  isWizardOpen: boolean;
  coverBase64?: string | null;
  doAdvancedToken?: boolean;
  tokenCustomization?: {
    name: string;
    symbol: string;
    tokenType: "erc20" | "erc721";
    totalSupply: number;
    mintingType: "fixed" | "inflation" | "deflation";
    inflationRate: number;
    deflationRate: number;
    distribution: { team: number; treasury: number; publicSale: number };
    vesting: { team: number; early: number };
    utility: {
      governance: boolean;
      access: boolean;
      staking: boolean;
      custom: string;
    };
  };
}
