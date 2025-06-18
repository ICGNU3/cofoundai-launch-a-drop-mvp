
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface RevenueSource {
  source: string;
  amount: number;
  percentage: number;
  color: string;
}

interface RevenueBreakdownProps {
  revenueData: RevenueSource[];
  totalRevenue: number;
  period: string;
}

export const RevenueBreakdown: React.FC<RevenueBreakdownProps> = ({
  revenueData,
  totalRevenue,
  period
}) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Revenue Breakdown
          <span className="text-sm text-text/60">{period}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="amount"
                  label={({ percentage }) => `${percentage.toFixed(1)}%`}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" fill="#36DF8C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Table */}
        <div className="mt-6 space-y-2">
          <h4 className="font-semibold text-sm">Revenue Sources</h4>
          {revenueData.map((source, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-sm">{source.source}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(source.amount)}</div>
                <div className="text-xs text-text/60">{source.percentage.toFixed(1)}%</div>
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-2 font-semibold border-t border-border">
            <span>Total Revenue</span>
            <span>{formatCurrency(totalRevenue)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
