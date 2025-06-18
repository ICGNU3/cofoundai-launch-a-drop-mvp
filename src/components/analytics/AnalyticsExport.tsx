
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileText, Table } from 'lucide-react';
import { LoadingButton } from '@/components/ui/LoadingButton';

interface ExportOption {
  id: string;
  label: string;
  description: string;
}

interface AnalyticsExportProps {
  onExport: (format: 'csv' | 'pdf', options: ExportOptions) => Promise<void>;
}

interface ExportOptions {
  format: 'csv' | 'pdf';
  dateRange: string;
  metrics: string[];
  includeCharts: boolean;
}

const availableMetrics: ExportOption[] = [
  { id: 'revenue', label: 'Revenue Data', description: 'Total revenue, breakdown by source' },
  { id: 'engagement', label: 'Engagement Metrics', description: 'Views, clicks, time on page' },
  { id: 'audience', label: 'Audience Data', description: 'Visitor demographics and behavior' },
  { id: 'performance', label: 'Performance Trends', description: 'Historical performance data' },
];

export const AnalyticsExport: React.FC<AnalyticsExportProps> = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'engagement']);
  const [includeCharts, setIncludeCharts] = useState(true);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(format, {
        format,
        dateRange,
        metrics: selectedMetrics,
        includeCharts: format === 'pdf' ? includeCharts : false
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Analytics
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Analytics Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label>Export Format</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                variant={format === 'csv' ? "default" : "outline"}
                onClick={() => setFormat('csv')}
                className="gap-2"
              >
                <Table className="w-4 h-4" />
                CSV
              </Button>
              <Button
                variant={format === 'pdf' ? "default" : "outline"}
                onClick={() => setFormat('pdf')}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label htmlFor="dateRange">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Metrics Selection */}
          <div>
            <Label>Data to Include</Label>
            <div className="mt-2 space-y-3">
              {availableMetrics.map((metric) => (
                <div key={metric.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => toggleMetric(metric.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={metric.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {metric.label}
                    </Label>
                    <p className="text-xs text-text/60">
                      {metric.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Options */}
          {format === 'pdf' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={includeCharts}
                onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
              />
              <Label htmlFor="includeCharts" className="text-sm">
                Include charts and visualizations
              </Label>
            </div>
          )}

          {/* Export Button */}
          <LoadingButton
            onClick={handleExport}
            loading={isExporting}
            loadingText="Exporting..."
            disabled={selectedMetrics.length === 0}
            className="w-full"
          >
            Export {format.toUpperCase()}
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
