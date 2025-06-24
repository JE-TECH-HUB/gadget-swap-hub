
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Activity,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface SystemStatus {
  database: 'healthy' | 'warning' | 'error';
  storage: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
  auth: 'healthy' | 'warning' | 'error';
}

interface SystemMetrics {
  uptime: string;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  storageUsed: number;
  storageTotal: number;
}

export const AdminSystemHealth = () => {
  const [status, setStatus] = useState<SystemStatus>({
    database: 'healthy',
    storage: 'healthy',
    api: 'healthy',
    auth: 'healthy'
  });
  
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: '99.9%',
    responseTime: 120,
    errorRate: 0.1,
    activeUsers: 45,
    storageUsed: 2.4,
    storageTotal: 10
  });
  
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      // Simulate health checks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock some occasional warnings/errors for demo
      const randomStatus = () => {
        const rand = Math.random();
        if (rand > 0.9) return 'error';
        if (rand > 0.7) return 'warning';
        return 'healthy';
      };

      setStatus({
        database: randomStatus() as any,
        storage: 'healthy',
        api: randomStatus() as any,
        auth: 'healthy'
      });

      setMetrics(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 200) + 80,
        errorRate: Math.random() * 0.5,
        activeUsers: Math.floor(Math.random() * 20) + 35
      }));

      setLastCheck(new Date());
      toast.success("System health check completed");
    } catch (error) {
      toast.error("Failed to check system health");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const overallHealth = Object.values(status).every(s => s === 'healthy') ? 'healthy' : 
                       Object.values(status).some(s => s === 'error') ? 'error' : 'warning';

  return (
    <div className="space-y-6">
      {/* Overall Health Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Health Overview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(overallHealth)}>
                {getStatusIcon(overallHealth)}
                <span className="ml-1 capitalize">{overallHealth}</span>
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={checkSystemHealth}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Last checked: {lastCheck.toLocaleTimeString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Database</span>
                  </div>
                  <Badge className={getStatusColor(status.database)}>
                    {status.database}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Storage</span>
                  </div>
                  <Badge className={getStatusColor(status.storage)}>
                    {status.storage}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">API</span>
                  </div>
                  <Badge className={getStatusColor(status.api)}>
                    {status.api}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Auth</span>
                  </div>
                  <Badge className={getStatusColor(status.auth)}>
                    {status.auth}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Uptime</span>
                <span className="font-medium">{metrics.uptime}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Avg Response Time</span>
                <span className="font-medium">{metrics.responseTime}ms</span>
              </div>
              <Progress value={(300 - metrics.responseTime) / 3} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Error Rate</span>
                <span className="font-medium">{metrics.errorRate.toFixed(2)}%</span>
              </div>
              <Progress value={100 - (metrics.errorRate * 20)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span>Active Users</span>
              </div>
              <Badge variant="outline">{metrics.activeUsers}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Avg Session</span>
              </div>
              <Badge variant="outline">12m</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Used Storage</span>
                <span className="font-medium">{metrics.storageUsed}GB / {metrics.storageTotal}GB</span>
              </div>
              <Progress value={(metrics.storageUsed / metrics.storageTotal) * 100} className="h-2" />
            </div>
            <div className="text-xs text-muted-foreground">
              {((metrics.storageTotal - metrics.storageUsed) / metrics.storageTotal * 100).toFixed(1)}% available
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(status.database === 'error' || status.api === 'error') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Critical system components are experiencing issues. Please check the logs and contact support if problems persist.
          </AlertDescription>
        </Alert>
      )}

      {(status.database === 'warning' || status.api === 'warning') && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Some system components are showing warning signs. Monitor closely for any degradation.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
