'use client';

import { MousePointerClick, MailOpenIcon, MailCheck, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid } from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { DashboardTypes } from '@/types/interface';
import SearchBar from '@/shared/SearchBar';
import { mockSearchFunction } from '@/lib/mockData';
import PerformanceCard from '@/shared/PerformanceCard';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardResponse {
  data: DashboardTypes;
}

const EmptyStateCard = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => (
  <Card className="w-full bg-white border-dashed border-2 border-gray-200 hover:border-gray-300 transition-all">
    <CardHeader className="items-center text-center">
      <div className="mb-4 text-gray-400">{icon}</div>
      <CardTitle className="text-lg text-gray-700">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-center text-gray-500">
      <p>{description}</p>
    </CardContent>
  </Card>
);

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
        // console.log(data)
        setError(null);
      } catch (error) {
        // console.error(error);
        setError('Unable to load dashboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  const chartConfig = {
    value: {
      label: 'Performance',
      color: '#10b981',
    },
  } satisfies ChartConfig;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center space-x-4">
            <AlertCircle className="text-red-500" size={40} />
            <CardTitle className="text-red-700">Dashboard Error</CardTitle>
          </CardHeader>
          <CardContent className="text-red-600">
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

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 rounded-lg">
      <div className="mb-5">
        <SearchBar
          searchFunction={mockSearchFunction}
          avatarSrc={user?.avatar}
          avatarFallback={user?.first_name}
          // notificationCount={12}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </>
        ) : (
          <>
            <Button
              onClick={() => router.push('/')}
              className="justify-start rounded-xl bg-white p-4 md:py-10 hover:shadow-md hover:scale-105 transition-all"
            >
              <MailCheck className="text-blue-600 mr-4" size={40} />
              <span className="text-lg font-semibold text-[#1E0E4E]">Create Email</span>
            </Button>
            <Button
              onClick={() => router.push('/dashboard/campaign/create')}
              className="justify-start rounded-xl bg-white p-4 md:py-10 hover:shadow-md hover:scale-105 transition-all"
            >
              <MailCheck className="text-purple-600 mr-4" size={40} />
              <span className="text-lg font-semibold text-[#1E0E4E]">Create Campaigns</span>
            </Button>
          </>
        )}
      </div>

      {/* Email Performance */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-[#1E0E4E] mb-6">Email Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </>
          ) : data?.emailPerformance ? (
            <>
              <PerformanceCard
                value={data.emailPerformance.emailsSent}
                label="Emails Sent"
                color="#004EEB"
                icon={<MailOpenIcon width={20} height={20} />}
              />
              <PerformanceCard
                value={data.emailPerformance.openRate.value}
                change={data.emailPerformance.openRate.change}
                label="Open Rate"
                color="#10b981"
                icon={<MailOpenIcon />}
              />
              <PerformanceCard
                value={data.emailPerformance.clickRate.value}
                change={data.emailPerformance.clickRate.change}
                label="Click Rate"
                color="#3b82f6"
                icon={<MousePointerClick />}
              />
            </>
          ) : (
            <EmptyStateCard 
              title="No Email Performance Data" 
              description="Start sending emails to track performance" 
              icon={<MailOpenIcon size={48} />} 
            />
          )}
        </div>
      </div>

      {/* Detailed Performance Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Performance */}
        <div>
          <h2 className="text-xl font-semibold text-[#1E0E4E] mb-6">Audience Performance</h2>
          {loading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : data?.audiencePerformance?.length ? (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dimension</TableHead>
                    <TableHead className="text-right">Emails Sent</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">Click Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.audiencePerformance.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-right">{row.emailsSent}</TableCell>
                      <TableCell className="text-right">{row.openRate}</TableCell>
                      <TableCell className="text-right">{row.clickRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyStateCard 
              title="No Audience Data" 
              description="Segment your audience to get insights" 
              icon={<MousePointerClick size={48} />} 
            />
          )}
        </div>

        {/* Campaign Performance */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-[#1E0E4E]">Campaign Performance</h2>
          {loading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : data?.campaignStats.data ? (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={data.campaignStats.data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value: string): string => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <EmptyStateCard 
              title="No Campaign Data" 
              description="Create campaigns to track performance" 
              icon={<MousePointerClick size={48} />} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
