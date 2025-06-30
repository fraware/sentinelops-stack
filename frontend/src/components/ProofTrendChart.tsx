
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Proof {
  id: string;
  timestamp: string;
  status: string;
  type: string;
  metadata: any;
  hash: string;
  size: number;
  validator: string;
}

interface ProofTrendChartProps {
  proofs: Proof[];
}

export const ProofTrendChart = ({ proofs }: ProofTrendChartProps) => {
  const chartData = useMemo(() => {
    if (!proofs || proofs.length === 0) return [];

    // Get last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentProofs = proofs.filter(proof => 
      new Date(proof.timestamp) > twentyFourHoursAgo
    );

    // Group by hour
    const hourlyData = new Map();
    
    // Initialize last 24 hours
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(Date.now() - i * 60 * 60 * 1000);
      const hourKey = hour.getHours();
      const timeLabel = hour.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      
      hourlyData.set(hourKey, {
        time: timeLabel,
        hour: hourKey,
        pass: 0,
        fail: 0
      });
    }

    // Count proofs by hour
    recentProofs.forEach(proof => {
      const proofHour = new Date(proof.timestamp).getHours();
      const hourData = hourlyData.get(proofHour);
      
      if (hourData) {
        const status = proof.status?.toLowerCase();
        if (status === 'pass' || status === 'valid') {
          hourData.pass += 1;
        } else if (status === 'fail' || status === 'invalid') {
          hourData.fail += 1;
        }
      }
    });

    return Array.from(hourlyData.values()).sort((a, b) => a.hour - b.hour);
  }, [proofs]);

  const chartConfig = {
    pass: {
      label: "PASS",
      color: "#4ADE80",
    },
    fail: {
      label: "FAIL", 
      color: "#EF4444",
    },
  };

  return (
    <div className="industrial-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-mono font-semibold mb-1">Proof Trends</h2>
        <p className="text-sm text-muted-foreground">
          PASS vs FAIL counts over 24 hours
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="pass"
              stroke="var(--color-pass)"
              strokeWidth={3}
              dot={{ fill: "var(--color-pass)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="fail"
              stroke="var(--color-fail)"
              strokeWidth={3}
              dot={{ fill: "var(--color-fail)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
