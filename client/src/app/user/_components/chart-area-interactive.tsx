'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const chartData = [
  { date: '2024-04-01', desktop: 297, mobile: 284 },
  { date: '2024-04-02', desktop: 321, mobile: 293 },
  { date: '2024-04-03', desktop: 311, mobile: 295 },
  { date: '2024-04-04', desktop: 327, mobile: 287 },
  { date: '2024-04-05', desktop: 338, mobile: 280 },
  { date: '2024-04-06', desktop: 330, mobile: 276 },
  { date: '2024-04-07', desktop: 332, mobile: 275 },
  { date: '2024-04-08', desktop: 327, mobile: 267 },
  { date: '2024-04-09', desktop: 317, mobile: 268 },
  { date: '2024-04-10', desktop: 309, mobile: 259 },
  { date: '2024-04-11', desktop: 297, mobile: 253 },
  { date: '2024-04-12', desktop: 286, mobile: 252 },
  { date: '2024-04-13', desktop: 277, mobile: 242 },
  { date: '2024-04-14', desktop: 271, mobile: 234 },
  { date: '2024-04-15', desktop: 259, mobile: 232 },
  { date: '2024-04-16', desktop: 258, mobile: 228 },
  { date: '2024-04-17', desktop: 247, mobile: 225 },
  { date: '2024-04-18', desktop: 247, mobile: 218 },
  { date: '2024-04-19', desktop: 240, mobile: 212 },
  { date: '2024-04-20', desktop: 234, mobile: 206 },
  { date: '2024-04-21', desktop: 226, mobile: 202 },
  { date: '2024-04-22', desktop: 226, mobile: 195 },
  { date: '2024-04-23', desktop: 223, mobile: 190 },
  { date: '2024-04-24', desktop: 221, mobile: 183 },
  { date: '2024-04-25', desktop: 219, mobile: 181 },
  { date: '2024-04-26', desktop: 221, mobile: 173 },
  { date: '2024-04-27', desktop: 217, mobile: 167 },
  { date: '2024-04-28', desktop: 219, mobile: 165 },
  { date: '2024-04-29', desktop: 221, mobile: 159 },
  { date: '2024-04-30', desktop: 222, mobile: 159 },
  { date: '2024-05-01', desktop: 226, mobile: 153 },
  { date: '2024-05-02', desktop: 231, mobile: 155 },
  { date: '2024-05-03', desktop: 237, mobile: 151 },
  { date: '2024-05-04', desktop: 247, mobile: 153 },
  { date: '2024-05-05', desktop: 257, mobile: 152 },
  { date: '2024-05-06', desktop: 266, mobile: 158 },
  { date: '2024-05-07', desktop: 274, mobile: 161 },
  { date: '2024-05-08', desktop: 283, mobile: 165 },
  { date: '2024-05-09', desktop: 289, mobile: 172 },
  { date: '2024-05-10', desktop: 295, mobile: 175 },
  { date: '2024-05-11', desktop: 300, mobile: 179 },
  { date: '2024-05-12', desktop: 308, mobile: 187 },
  { date: '2024-05-13', desktop: 311, mobile: 189 },
  { date: '2024-05-14', desktop: 318, mobile: 195 },
  { date: '2024-05-15', desktop: 323, mobile: 199 },
  { date: '2024-05-16', desktop: 328, mobile: 205 },
  { date: '2024-05-17', desktop: 332, mobile: 209 },
  { date: '2024-05-18', desktop: 338, mobile: 211 },
  { date: '2024-05-19', desktop: 336, mobile: 214 },
  { date: '2024-05-20', desktop: 338, mobile: 215 },
  { date: '2024-05-21', desktop: 338, mobile: 217 },
  { date: '2024-05-22', desktop: 337, mobile: 220 },
  { date: '2024-05-23', desktop: 331, mobile: 222 },
  { date: '2024-05-24', desktop: 328, mobile: 224 },
  { date: '2024-05-25', desktop: 321, mobile: 228 },
  { date: '2024-05-26', desktop: 313, mobile: 231 },
  { date: '2024-05-27', desktop: 306, mobile: 233 },
  { date: '2024-05-28', desktop: 297, mobile: 236 },
  { date: '2024-05-29', desktop: 285, mobile: 239 },
  { date: '2024-05-30', desktop: 274, mobile: 240 },
  { date: '2024-05-31', desktop: 266, mobile: 243 },
  { date: '2024-06-01', desktop: 258, mobile: 242 },
  { date: '2024-06-02', desktop: 248, mobile: 244 },
  { date: '2024-06-03', desktop: 243, mobile: 243 },
  { date: '2024-06-04', desktop: 234, mobile: 244 },
  { date: '2024-06-05', desktop: 228, mobile: 245 },
  { date: '2024-06-06', desktop: 221, mobile: 245 },
  { date: '2024-06-07', desktop: 220, mobile: 245 },
  { date: '2024-06-08', desktop: 216, mobile: 246 },
  { date: '2024-06-09', desktop: 213, mobile: 246 },
  { date: '2024-06-10', desktop: 215, mobile: 246 },
  { date: '2024-06-11', desktop: 215, mobile: 246 },
  { date: '2024-06-12', desktop: 218, mobile: 245 },
  { date: '2024-06-13', desktop: 223, mobile: 245 },
  { date: '2024-06-14', desktop: 231, mobile: 244 },
  { date: '2024-06-15', desktop: 240, mobile: 243 },
  { date: '2024-06-16', desktop: 250, mobile: 242 },
  { date: '2024-06-17', desktop: 260, mobile: 241 },
  { date: '2024-06-18', desktop: 271, mobile: 239 },
  { date: '2024-06-19', desktop: 280, mobile: 237 },
  { date: '2024-06-20', desktop: 288, mobile: 235 },
  { date: '2024-06-21', desktop: 295, mobile: 234 },
  { date: '2024-06-22', desktop: 304, mobile: 232 },
  { date: '2024-06-23', desktop: 309, mobile: 230 },
  { date: '2024-06-24', desktop: 316, mobile: 229 },
  { date: '2024-06-25', desktop: 319, mobile: 227 },
  { date: '2024-06-26', desktop: 326, mobile: 224 },
  { date: '2024-06-27', desktop: 328, mobile: 223 },
  { date: '2024-06-28', desktop: 331, mobile: 222 },
  { date: '2024-06-29', desktop: 333, mobile: 221 },
  { date: '2024-06-30', desktop: 334, mobile: 220 },
];

const chartConfig = {
  visitors: {
    label: 'Load',
  },
  desktop: {
    label: 'Pickup',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Trash',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState('90d');

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date('2024-06-30');
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1 text-center sm:text-left'>
          <CardTitle>Total Load</CardTitle>
          <CardDescription>
            Showing total load for the last time range
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className='w-[160px] rounded-lg sm:ml-auto'
            aria-label='Select a value'>
            <SelectValue placeholder='Last 3 months' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem value='90d' className='rounded-lg'>
              Last 3 months
            </SelectItem>
            <SelectItem value='30d' className='rounded-lg'>
              Last 30 days
            </SelectItem>
            <SelectItem value='7d' className='rounded-lg'>
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-desktop)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-desktop)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillMobile' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-mobile)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-mobile)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='mobile'
              type='natural'
              fill='url(#fillMobile)'
              stroke='var(--color-mobile)'
              stackId='a'
            />
            <Area
              dataKey='desktop'
              type='natural'
              fill='url(#fillDesktop)'
              stroke='var(--color-desktop)'
              stackId='a'
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
