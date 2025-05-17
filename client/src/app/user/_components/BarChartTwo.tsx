'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { browser: 'Innenstadt-West', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'Durlach', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'Südweststadt', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'Innenstadt-Ost', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'Weststadt', visitors: 90, fill: 'var(--color-other)' },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription>January - April 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='w-full'
          style={{ minHeight: '300px' }}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              left: 120,
              right: 20,
              top: 10,
              bottom: 10,
            }}>
            <YAxis
              dataKey='browser'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
              tick={{ fontSize: 12 }}
            />
            <XAxis dataKey='visitors' type='number' hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='visitors' layout='vertical' radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
