
import { MetricCard } from "./MetricCard";
import { ServiceCard } from "./ServiceCard";
import { AlertPanel } from "./AlertPanel";

// Mock data - in a real app this would come from your API
const systemMetrics = [
  {
    title: "System Health",
    value: "98.7%",
    status: 'pass' as const,
    subtitle: "All critical services operational",
    trend: 2.1
  },
  {
    title: "Active Services",
    value: "12/14",
    status: 'warning' as const,
    subtitle: "2 services require attention",
    trend: -14.3
  },
  {
    title: "Response Time",
    value: "247ms",
    status: 'pass' as const,
    subtitle: "Average across all endpoints",
    trend: -8.2
  },
  {
    title: "Error Rate",
    value: "0.03%",
    status: 'pass' as const,
    subtitle: "Last 24 hours",
    trend: -12.5
  }
];

const services = [
  {
    name: "API Gateway",
    status: 'pass' as const,
    uptime: "99.97%",
    responseTime: "145ms",
    lastCheck: "30s ago",
    endpoint: "api.sentinelops.com"
  },
  {
    name: "Auth Service",
    status: 'pass' as const,
    uptime: "99.92%", 
    responseTime: "89ms",
    lastCheck: "45s ago",
    endpoint: "auth.sentinelops.com"
  },
  {
    name: "Database Cluster",
    status: 'warning' as const,
    uptime: "99.1%",
    responseTime: "324ms",
    lastCheck: "1m ago",
    endpoint: "db-cluster-01"
  },
  {
    name: "Cache Layer",
    status: 'pass' as const,
    uptime: "99.98%",
    responseTime: "12ms", 
    lastCheck: "15s ago",
    endpoint: "redis-cluster"
  },
  {
    name: "Message Queue",
    status: 'fail' as const,
    uptime: "87.3%",
    responseTime: "1.2s",
    lastCheck: "2m ago",
    endpoint: "rabbitmq-01"
  },
  {
    name: "File Storage",
    status: 'pass' as const,
    uptime: "99.94%",
    responseTime: "203ms",
    lastCheck: "1m ago", 
    endpoint: "s3.sentinelops.com"
  }
];

const alerts = [
  {
    id: "1",
    type: 'error' as const,
    message: "Message Queue connection pool exhausted",
    timestamp: "2m ago",
    service: "rabbitmq-01"
  },
  {
    id: "2", 
    type: 'warning' as const,
    message: "Database response time above threshold",
    timestamp: "5m ago",
    service: "db-cluster-01"
  },
  {
    id: "3",
    type: 'info' as const,
    message: "Scheduled maintenance completed successfully",
    timestamp: "15m ago",
    service: "cache-layer"
  }
];

export const SystemOverview = () => {
  return (
    <div className="space-y-8">
      {/* System Metrics */}
      <section>
        <div className="mb-6">
          <h1 className="text-3xl font-mono font-bold mb-2">System Overview</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and health status of SentinelOps infrastructure
          </p>
        </div>
        
        <div className="industrial-grid">
          {systemMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </section>

      {/* Services and Alerts */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Services Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-mono font-semibold mb-6">Service Status</h2>
          <div className="industrial-grid">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <AlertPanel alerts={alerts} className="h-fit" />
        </div>
      </div>
    </div>
  );
};
