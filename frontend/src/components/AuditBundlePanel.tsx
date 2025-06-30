
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const AuditBundlePanel = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedHour, setSelectedHour] = useState<string>();
  const [exportFormat, setExportFormat] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAuditData = (date: Date, hour: string, format: string) => {
    const startTime = new Date(date);
    startTime.setHours(parseInt(hour), 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(parseInt(hour) + 1, 0, 0, 0);

    const mockProofs = [
      {
        id: `proof-${Date.now()}-001`,
        status: 'PASS',
        propertyId: 'PROP-001',
        timestamp: startTime.toISOString(),
        validator: 'zkp-validator-001',
        hash: '0x1234567890abcdef',
        size: 2048,
        metadata: {
          startTs: startTime.toISOString(),
          endTs: endTime.toISOString(),
          propertyId: 'PROP-001'
        }
      },
      {
        id: `proof-${Date.now()}-002`,
        status: 'FAIL',
        propertyId: 'PROP-002',
        timestamp: new Date(startTime.getTime() + 1800000).toISOString(), // 30 min later
        validator: 'zkp-validator-002',
        hash: '0xfedcba0987654321',
        size: 1024,
        metadata: {
          startTs: new Date(startTime.getTime() + 1800000).toISOString(),
          endTs: new Date(startTime.getTime() + 3600000).toISOString(),
          propertyId: 'PROP-002'
        }
      }
    ];

    if (format === 'phmsa') {
      // Generate PHMSA XML format
      return `<?xml version="1.0" encoding="UTF-8"?>
<phmsa:AuditReport xmlns:phmsa="http://phmsa.dot.gov/audit/v1.0" version="1.0">
  <phmsa:Header>
    <phmsa:GeneratedAt>${new Date().toISOString()}</phmsa:GeneratedAt>
    <phmsa:ReportPeriod>
      <phmsa:StartTime>${startTime.toISOString()}</phmsa:StartTime>
      <phmsa:EndTime>${endTime.toISOString()}</phmsa:EndTime>
    </phmsa:ReportPeriod>
  </phmsa:Header>
  <phmsa:ProofVerifications>
    ${mockProofs.map(proof => `
    <phmsa:Proof>
      <phmsa:ID>${proof.id}</phmsa:ID>
      <phmsa:Status>${proof.status}</phmsa:Status>
      <phmsa:PropertyID>${proof.propertyId}</phmsa:PropertyID>
      <phmsa:Timestamp>${proof.timestamp}</phmsa:Timestamp>
      <phmsa:Validator>${proof.validator}</phmsa:Validator>
      <phmsa:Hash>${proof.hash}</phmsa:Hash>
    </phmsa:Proof>`).join('')}
  </phmsa:ProofVerifications>
</phmsa:AuditReport>`;
    } else {
      // Generate IEC 61508 JSON format
      return JSON.stringify({
        standard: "IEC 61508",
        version: "2.0",
        generatedAt: new Date().toISOString(),
        reportPeriod: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        },
        safetyIntegrityLevel: "SIL-3",
        proofVerifications: mockProofs,
        summary: {
          totalProofs: mockProofs.length,
          passedProofs: mockProofs.filter(p => p.status === 'PASS').length,
          failedProofs: mockProofs.filter(p => p.status === 'FAIL').length,
          successRate: (mockProofs.filter(p => p.status === 'PASS').length / mockProofs.length * 100).toFixed(2) + '%'
        }
      }, null, 2);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  };

  const handleGenerate = async () => {
    // Validation
    if (!selectedDate || selectedHour === undefined || !exportFormat) {
      toast.error('Please select date, hour, and export format');
      return;
    }

    // Prevent selecting future dates
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(parseInt(selectedHour));
    
    if (selectedDateTime > now) {
      toast.error('Cannot generate audit for future dates');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate audit data
      const auditContent = generateAuditData(selectedDate, selectedHour, exportFormat);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const hourStr = selectedHour.padStart(2, '0');
      
      // Determine file extension and MIME type
      const isXml = exportFormat === 'phmsa';
      const extension = isXml ? 'xml' : 'json';
      const mimeType = isXml ? 'application/xml' : 'application/json';
      const filename = `audit-${exportFormat}-${dateStr}-${hourStr}h.${extension}`;
      
      // Download the file
      const success = downloadFile(auditContent, filename, mimeType);
      
      if (success) {
        toast.success('Audit bundle generated successfully', {
          description: `Downloaded ${filename}`,
          duration: 5000,
        });
      } else {
        throw new Error('Download failed');
      }
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to generate audit bundle', {
        description: 'Please try again or contact support if the issue persists.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = new Date();

  return (
    <Card className="industrial-card">
      <CardHeader>
        <CardTitle className="font-mono">Generate Audit Bundle</CardTitle>
        <CardDescription>
          Export proof verification data for compliance reporting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date > today}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Hour Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hour</label>
            <Select value={selectedHour} onValueChange={setSelectedHour}>
              <SelectTrigger>
                <SelectValue placeholder="Select hour" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phmsa">PHMSA XML v1.0</SelectItem>
                <SelectItem value="iec61508">IEC 61508 JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !selectedDate || selectedHour === undefined || !exportFormat}
          className="w-full gap-2"
        >
          <Download className="h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Audit Bundle'}
        </Button>
      </CardContent>
    </Card>
  );
};
