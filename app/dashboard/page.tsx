'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  MousePointerClick,
  MailOpenIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
} from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { DashboardTypes } from '@/types/interface';
import SearchBar from '@/shared/SearchBar';
import { mockSearchFunction } from '@/lib/mockData';
import PerformanceCard from '@/shared/PerformanceCard';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/dashboard', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch data');
        const responseData = await response.json();
        setData(responseData.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartConfig = {
    value: {
      label: 'Performance',
      color: '#10b981',
    },
  } satisfies ChartConfig;

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 rounded-lg">
      <div className="mb-5">
        <SearchBar
          searchFunction={mockSearchFunction}
          avatarSrc={user?.avatar}
          avatarFallback={user?.first_name}
          notificationCount={12}
        />
      </div>

      <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Mail, label: 'Create Email', color: 'text-blue-600' },
          { icon: MousePointerClick, label: 'Create Campaigns', color: 'text-purple-600' },
        ].map((action) => (
          <motion.div
            key={action.label}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <span className="text-lg font-semibold text-[#1E0E4E]">{action.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold text-[#1E0E4E] mb-6">Email Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.emailPerformance && (
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
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-[#1E0E4E] mb-6">Audience Performance</h2>
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
                {data?.audiencePerformance?.map((row) => (
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
        </div>

        <div className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-[#1E0E4E]">Campaign Performance</h2>
        {data?.campaignStats && (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={data?.campaignStats.data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </ChartContainer>)}
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
