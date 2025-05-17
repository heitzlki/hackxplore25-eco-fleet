'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export const description =
  'An interactive area chart showing OCR extraction metrics';

const chartData = [
  { date: '2024-05-21', textAccuracy: 80, structureAccuracy: 65 },
  { date: '2024-05-22', textAccuracy: 85, structureAccuracy: 70 },
  { date: '2024-05-23', textAccuracy: 78, structureAccuracy: 63 },
  { date: '2024-05-24', textAccuracy: 82, structureAccuracy: 68 },
  { date: '2024-05-25', textAccuracy: 87, structureAccuracy: 72 },
  { date: '2024-05-26', textAccuracy: 90, structureAccuracy: 75 },
  { date: '2024-05-27', textAccuracy: 83, structureAccuracy: 70 },
  { date: '2024-05-28', textAccuracy: 85, structureAccuracy: 68 },
  { date: '2024-05-29', textAccuracy: 88, structureAccuracy: 73 },
  { date: '2024-05-30', textAccuracy: 92, structureAccuracy: 77 },
  { date: '2024-05-31', textAccuracy: 85, structureAccuracy: 72 },
  { date: '2024-06-01', textAccuracy: 87, structureAccuracy: 70 },
  { date: '2024-06-02', textAccuracy: 91, structureAccuracy: 76 },
  { date: '2024-06-03', textAccuracy: 94, structureAccuracy: 80 },
  { date: '2024-06-04', textAccuracy: 89, structureAccuracy: 75 },
  { date: '2024-06-05', textAccuracy: 86, structureAccuracy: 72 },
  { date: '2024-06-06', textAccuracy: 90, structureAccuracy: 76 },
  { date: '2024-06-07', textAccuracy: 95, structureAccuracy: 81 },
  { date: '2024-06-08', textAccuracy: 93, structureAccuracy: 79 },
  { date: '2024-06-09', textAccuracy: 97, structureAccuracy: 83 },
  { date: '2024-06-10', textAccuracy: 92, structureAccuracy: 78 },
  { date: '2024-06-11', textAccuracy: 88, structureAccuracy: 73 },
  { date: '2024-06-12', textAccuracy: 90, structureAccuracy: 76 },
  { date: '2024-06-13', textAccuracy: 94, structureAccuracy: 80 },
  { date: '2024-06-14', textAccuracy: 89, structureAccuracy: 75 },
  { date: '2024-06-15', textAccuracy: 85, structureAccuracy: 70 },
  { date: '2024-06-16', textAccuracy: 91, structureAccuracy: 76 },
  { date: '2024-06-17', textAccuracy: 96, structureAccuracy: 81 },
  { date: '2024-06-18', textAccuracy: 90, structureAccuracy: 76 },
  { date: '2024-06-19', textAccuracy: 86, structureAccuracy: 72 },
  { date: '2024-06-20', textAccuracy: 93, structureAccuracy: 79 },
  { date: '2024-06-21', textAccuracy: 98, structureAccuracy: 84 },
  { date: '2024-06-22', textAccuracy: 95, structureAccuracy: 81 },
  { date: '2024-06-23', textAccuracy: 96, structureAccuracy: 82 },
  { date: '2024-06-24', textAccuracy: 98, structureAccuracy: 85 },
  { date: '2024-06-25', textAccuracy: 100, structureAccuracy: 87 },
  { date: '2024-06-26', textAccuracy: 102, structureAccuracy: 89 },
  { date: '2024-06-27', textAccuracy: 104, structureAccuracy: 91 },
  { date: '2024-06-28', textAccuracy: 106, structureAccuracy: 93 },
  { date: '2024-06-29', textAccuracy: 108, structureAccuracy: 95 },
  { date: '2024-06-30', textAccuracy: 110, structureAccuracy: 97 },
];

const chartConfig = {
  accuracy: {
    label: 'Accuracy (%)',
  },
  textAccuracy: {
    label: 'Text Accuracy',
    color: '#38e8b6',
  },
  structureAccuracy: {
    label: 'Structure Accuracy',
    color: '##8f53be',
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

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
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>OCR Extraction Accuracy</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Text and structure recognition accuracy over time
          </span>
          <span className='@[540px]/card:hidden'>OCR accuracy trends</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={setTimeRange}
            variant='outline'
            className='hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex'>
            <ToggleGroupItem value='90d'>Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value='30d'>Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value='7d'>Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden'
              size='sm'
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
        </CardAction>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id='fillTextAccuracy' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#38e8b6' stopOpacity={1.0} />
                <stop offset='95%' stopColor='#38e8b6' stopOpacity={0.1} />
              </linearGradient>
              <linearGradient
                id='fillStructureAccuracy'
                x1='0'
                y1='0'
                x2='0'
                y2='1'>
                <stop offset='5%' stopColor='#8f53be' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#8f53be' stopOpacity={0.1} />
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
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  formatter={(value) => `${value}%`}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='structureAccuracy'
              type='natural'
              fill='url(#fillStructureAccuracy)'
              stroke='#8f53be'
              stackId='a'
            />
            <Area
              dataKey='textAccuracy'
              type='natural'
              fill='url(#fillTextAccuracy)'
              stroke='#38e8b6'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
