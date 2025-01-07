'use client';

import { motion } from 'framer-motion';
import {
  MoreVertical,
  Mail,
  MousePointerClick,
  ArrowUp,
  Send,
  Eye,
  MousePointer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Banner } from '@/shared/Banner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import SearchBar from '@/shared/SearchBar';
import { mockSearchFunction } from '@/lib/mockData';

const chartData = [
  { month: 'Jan', openRate: 700, ctr: 400, bounceRate: 200 },
  { month: 'Feb', openRate: 800, ctr: 450, bounceRate: 180 },
  { month: 'Mar', openRate: 600, ctr: 350, bounceRate: 160 },
  { month: 'Apr', openRate: 750, ctr: 400, bounceRate: 190 },
  { month: 'May', openRate: 650, ctr: 380, bounceRate: 170 },
  { month: 'Jun', openRate: 700, ctr: 420, bounceRate: 185 },
  { month: 'Jul', openRate: 680, ctr: 390, bounceRate: 175 },
  { month: 'Aug', openRate: 720, ctr: 410, bounceRate: 180 },
  { month: 'Sep', openRate: 0, ctr: 0, bounceRate: 0 },
  { month: 'Oct', openRate: 0, ctr: 0, bounceRate: 0 },
  { month: 'Nov', openRate: 0, ctr: 0, bounceRate: 0 },
  { month: 'Dec', openRate: 0, ctr: 0, bounceRate: 0 },
];

const performanceMetrics = [
  {
    label: 'Emails sent',
    value: '3,189',
    percent: '12%',
    icon: Send,
    color: 'bg-blue-600',
  },
  {
    label: 'Open rate',
    value: '2,109',
    percent: '8%',
    icon: Eye,
    color: 'bg-green-600',
  },
  {
    label: 'Click rate',
    value: '4,234',
    percent: '15%',
    icon: MousePointer,
    color: 'bg-purple-600',
  },
];

const audienceData = [
  { name: 'Emma Queen', sent: '678', open: '35%', click: '15%' },
  { name: 'Ade Adam', sent: '218', open: '45%', click: '27%' },
  { name: 'Uche Eucharia', sent: '183', open: '34%', click: '83%' },
];

export default function Dashboard() {
  const handleSearch = (query: string) => {
    console.log('Home component - Searching for:', query);
  };
  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen rounded-lg">
      <div className="mb-5">
        <SearchBar
          searchFunction={mockSearchFunction}
          avatarSrc="assets/logo.svg"
          avatarFallback="JD"
          // notificationCount={12}
        />
      </div>
      <Banner name="Collins" />

      <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-[800px] mt-12">
        {[
          { icon: Mail, label: 'Create email', color: 'text-blue-600' },
          { icon: MousePointerClick, label: 'Create campaigns', color: 'text-purple-600' },
        ].map((action) => (
          <motion.div
            key={action.label}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-gray-50 p-4 md:p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <span className="text-base md:text-lg font-semibold text-[#1E0E4E]">
                {action.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-[#1E0E4E]">Email performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl bg-white p-4 md:p-6 relative"
            >
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <metric.icon
                    className={`${metric.color} text-white rounded-full p-2 mb-4`}
                    size={34}
                  />
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <div className="flex justify-between items-center w-full mt-2">
                    <p className="text-2xl md:text-3xl font-bold">{metric.value}</p>
                    <div className="bg-[#ECFDF3] border border-[#D3F9D8] rounded-lg px-2 py-1">
                      <span className="text-[#2B8A3E] text-sm flex items-center">
                        <ArrowUp size={16} className="mr-1" /> {metric.percent}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#1E0E4E]">Audience performance</h2>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dimension</TableHead>
                  <TableHead className="text-right">Emails sent</TableHead>
                  <TableHead className="text-right">Open rate</TableHead>
                  <TableHead className="text-right">Click rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audienceData.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-right">{row.sent}</TableCell>
                    <TableCell className="text-right">{row.open}</TableCell>
                    <TableCell className="text-right">{row.click}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-[#1E0E4E]">Your campaigns</h2>
            <Select defaultValue="thisYear">
              <SelectTrigger className="w-[140px] md:w-[180px]">
                <SelectValue placeholder="This year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisYear">This year</SelectItem>
                <SelectItem value="lastYear">Last year</SelectItem>
                <SelectItem value="allTime">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6">
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="openRate" fill="#4F46E5" name="Open rate" />
                  <Bar dataKey="ctr" fill="#6366F1" name="CTR" />
                  <Bar dataKey="bounceRate" fill="#818CF8" name="Bounce rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
