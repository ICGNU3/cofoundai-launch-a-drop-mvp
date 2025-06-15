
import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";
import type { Role, Expense } from "@/hooks/useWizardState";

type InteractiveBudgetChartProps = {
  roles: Role[];
  expenses: Expense[];
  onRolePercentChange: (roleIndex: number, newPercent: number) => void;
  pledgeAmount: number;
};

const ROLE_COLORS = [
  "#9A4DFF", "#5D5FEF", "#FF6B6B", "#4ECDC4", "#45B7D1", 
  "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"
];

const EXPENSE_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#AED6F1", "#A9DFBF"
];

export const InteractiveBudgetChart: React.FC<InteractiveBudgetChartProps> = ({
  roles,
  expenses,
  onRolePercentChange,
  pledgeAmount,
}) => {
  const roleData = roles.map((role, index) => ({
    name: role.roleName,
    value: role.percentNum || role.percent,
    color: ROLE_COLORS[index % ROLE_COLORS.length],
    index,
  }));

  const expenseData = expenses.map((expense, index) => ({
    name: expense.expenseName,
    value: expense.amountUSDC,
    color: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
    type: expense.payoutType,
  }));

  // Add pledge amount to expense visualization
  if (pledgeAmount > 0) {
    expenseData.push({
      name: "Revenue Share Pool",
      value: pledgeAmount,
      color: "#9A4DFF",
      type: "revenue" as any,
    });
  }

  const handlePieClick = (data: any, index: number) => {
    // For now, we'll handle this through the existing UI
    // In a full implementation, this would enable drag interactions
    console.log("Pie slice clicked:", data, index);
  };

  const roleChartConfig = {
    value: {
      label: "Percentage",
    },
  };

  const expenseChartConfig = {
    value: {
      label: "Amount (USDC)",
    },
  };

  return (
    <div className="space-y-6">
      {/* Role Allocation Pie Chart */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4 text-center">Role Allocation</h3>
        <ChartContainer config={roleChartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                className="cursor-pointer"
              >
                {roleData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="#18181a"
                    strokeWidth={2}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Expense Distribution Bar Chart */}
      {expenseData.length > 0 && (
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-4 text-center">Budget Distribution</h3>
          <ChartContainer config={expenseChartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181a",
                    border: "1px solid #333",
                    borderRadius: "6px",
                  }}
                  formatter={(value, name) => [`$${value} USDC`, name]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {expenseData.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </div>
  );
};
