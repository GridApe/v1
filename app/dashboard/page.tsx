'use client';

import { MousePointerClick, MailOpenIcon, MailCheck, AlertCircle, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, YAxis } from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { DashboardTypes } from '@/types/interface';
import SearchBar from '@/shared/SearchBar';
import { mockSearchFunction } from '@/lib/mockData';
import PerformanceCard from '@/shared/PerformanceCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

interface DashboardResponse {
  data: DashboardTypes;
}

const EmptyStateCard = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="w-full bg-white backdrop-blur-sm border  shadow-sm">
      <CardHeader className="items-center text-center">
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-lg ">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center ">
        <p>{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-600">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartLegendContent = ({ payload }: any) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/dashboard', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const responseData = await response.json() as DashboardResponse;
        setData(responseData.data);
        setError(null);
      } catch (error) {
        setError('Unable to load dashboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#2E3192] to-[#1a1c5c] p-4">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center space-x-4">
            <AlertCircle className="text-red-500" size={40} />
            <CardTitle className="text-white">Dashboard Error</CardTitle>
          </CardHeader>
          <CardContent className="text-white/80">
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 w-full bg-red-500 hover:bg-red-600"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
  const chartConfig = {
    totalCampaigns: {
      label: "Total Campaigns",
      color: "#2563eb",
    },
    completedCampaigns: {
      label: "Completed",
      color: "#10b981",
    },
    draftCampaigns: {
      label: "Drafts",
      color: "#f59e0b",
    },
    totalOpens: {
      label: "Total Opens",
      color: "#8b5cf6",
    },
    totalClicks: {
      label: "Total Clicks",
      color: "#ef4444",
    }
  } satisfies ChartConfig;
  

  return (
    <motion.div 
      className="p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-b from-[#fafaff] to-[#f0f2f8]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-900 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Search Bar */}
        <motion.div 
          className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar
            searchFunction={mockSearchFunction}
            avatarSrc={user?.avatar}
            avatarFallback={user?.first_name}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <>
              <Skeleton className="h-32 w-full rounded-xl bg-white/10" />
              <Skeleton className="h-32 w-full rounded-xl bg-white/10" />
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => router.push('/')}
                  className="w-full h-32 justify-start rounded-xl bg-white p-6 border  hover:bg-gray-50 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-blue-500/20">
                      <MailCheck className="text-blue-500" size={24} />
                    </div>
                    <span className="text-lg font-semibold text-black">Create Email</span>
                  </div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => router.push('/dashboard/campaign/create')}
                  className="w-full h-32 justify-start rounded-xl bg-white p-6 border  hover:bg-gray-50 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-purple-500/20">
                      <Plus className="text-purple-500" size={24} />
                    </div>
                    <span className="text-lg font-semibold text-black">Create Campaigns</span>
                  </div>
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Email Performance */}
        <motion.div 
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold">Email Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-32 w-full rounded-xl bg-white/10" />
                <Skeleton className="h-32 w-full rounded-xl bg-white/10" />
                <Skeleton className="h-32 w-full rounded-xl bg-white/10" />
              </>
            ) : data?.emailPerformance ? (
              <>
                <PerformanceCard
                  value={data.emailPerformance.emailsSent}
                  label="Emails Sent"
                  color="#004EEB"
                  icon={<MailOpenIcon className="text-blue-500" />}
                />
                <PerformanceCard
                  value={data.emailPerformance.openRate.value}
                  change={data.emailPerformance.openRate.change}
                  label="Open Rate"
                  color="#10b981"
                  icon={<MailOpenIcon className="text-green-500" />}
                />
                <PerformanceCard
                  value={data.emailPerformance.clickRate.value}
                  change={data.emailPerformance.clickRate.change}
                  label="Click Rate"
                  color="#3b82f6"
                  icon={<MousePointerClick className="text-blue-500" />}
                />
              </>
            ) : (
              <EmptyStateCard 
                title="No Email Performance Data" 
                description="Start sending emails to track performance" 
                icon={<MailOpenIcon size={48} className="text-white/60" />} 
              />
            )}
          </div>
        </motion.div>

        {/* Detailed Performance Sections */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Audience Performance */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold  mb-6">Audience Performance</h2>
            {loading ? (
              <Skeleton className="h-96 w-full rounded-xl bg-white" />
            ) : data?.audiencePerformance?.length ? (
              <div className="bg-white rounded-xl p-6 border shadow-sm overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="">Audience</TableHead>
                      <TableHead className="text-right ">Emails Sent</TableHead>
                      <TableHead className="text-right ">Open Rate</TableHead>
                      <TableHead className="text-right ">Click Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.audiencePerformance.map((row) => (
                      <TableRow key={row.name} className="border-white/10">
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-right ">{row.emailsSent}</TableCell>
                        <TableCell className="text-right">{row.openRate}</TableCell>
                        <TableCell className="text-right ">{row.clickRate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyStateCard 
                title="No Audience Data" 
                description="Segment your audience to get insights" 
                icon={<MousePointerClick size={48} className="" />} 
              />
            )}
          </motion.div>

          {/* Campaign Performance */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Campaign Performance</h2>
              <span className="text-sm text-gray-500">{data?.campaignStats.timeFrame}</span>
            </div>
            {loading ? (
              <Skeleton className="h-96 w-full rounded-xl bg-white/10" />
            ) : data?.campaignStats.data ? (
              <div className="rounded-xl p-6 border bg-white shadow-sm">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <BarChart 
                    data={data.campaignStats.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      stroke="#666"
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      stroke="#666"
                      fontSize={12}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend content={<ChartLegendContent />} />
                    <Bar 
                      dataKey="totalCampaigns" 
                      name="Total Campaigns"
                      fill="#2563eb" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="completedCampaigns" 
                      name="Completed"
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="draftCampaigns" 
                      name="Drafts"
                      fill="#f59e0b" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="totalOpens" 
                      name="Total Opens"
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="totalClicks" 
                      name="Total Clicks"
                      fill="#ef4444" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            ) : (
              <EmptyStateCard 
                title="No Campaign Data" 
                description="Create campaigns to track performance" 
                icon={<MousePointerClick size={48} className="" />} 
              />
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
