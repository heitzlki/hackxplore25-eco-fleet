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
  { date: '2024-04-01', wastePickup: 222, wasteLoad: 150 },
  { date: '2024-04-02', wastePickup: 97, wasteLoad: 180 },
  { date: '2024-04-03', wastePickup: 167, wasteLoad: 120 },
  { date: '2024-04-04', wastePickup: 242, wasteLoad: 260 },
  { date: '2024-04-05', wastePickup: 373, wasteLoad: 290 },
  { date: '2024-04-06', wastePickup: 301, wasteLoad: 340 },
  { date: '2024-04-07', wastePickup: 245, wasteLoad: 180 },
  { date: '2024-04-08', wastePickup: 409, wasteLoad: 320 },
  { date: '2024-04-09', wastePickup: 59, wasteLoad: 110 },
  { date: '2024-04-10', wastePickup: 261, wasteLoad: 190 },
  { date: '2024-04-11', wastePickup: 327, wasteLoad: 350 },
  { date: '2024-04-12', wastePickup: 292, wasteLoad: 210 },
  { date: '2024-04-13', wastePickup: 342, wasteLoad: 380 },
  { date: '2024-04-14', wastePickup: 137, wasteLoad: 220 },
  { date: '2024-04-15', wastePickup: 120, wasteLoad: 170 },
  { date: '2024-04-16', wastePickup: 138, wasteLoad: 190 },
  { date: '2024-04-17', wastePickup: 446, wasteLoad: 360 },
  { date: '2024-04-18', wastePickup: 364, wasteLoad: 410 },
  { date: '2024-04-19', wastePickup: 243, wasteLoad: 180 },
  { date: '2024-04-20', wastePickup: 89, wasteLoad: 150 },
  { date: '2024-04-21', wastePickup: 137, wasteLoad: 200 },
  { date: '2024-04-22', wastePickup: 224, wasteLoad: 170 },
  { date: '2024-04-23', wastePickup: 138, wasteLoad: 230 },
  { date: '2024-04-24', wastePickup: 387, wasteLoad: 290 },
  { date: '2024-04-25', wastePickup: 215, wasteLoad: 250 },
  { date: '2024-04-26', wastePickup: 75, wasteLoad: 130 },
  { date: '2024-04-27', wastePickup: 383, wasteLoad: 420 },
  { date: '2024-04-28', wastePickup: 122, wasteLoad: 180 },
  { date: '2024-04-29', wastePickup: 315, wasteLoad: 240 },
  { date: '2024-04-30', wastePickup: 454, wasteLoad: 380 },
  { date: '2024-05-01', wastePickup: 165, wasteLoad: 220 },
  { date: '2024-05-02', wastePickup: 293, wasteLoad: 310 },
  { date: '2024-05-03', wastePickup: 247, wasteLoad: 190 },
  { date: '2024-05-04', wastePickup: 385, wasteLoad: 420 },
  { date: '2024-05-05', wastePickup: 481, wasteLoad: 390 },
  { date: '2024-05-06', wastePickup: 498, wasteLoad: 520 },
  { date: '2024-05-07', wastePickup: 388, wasteLoad: 300 },
  { date: '2024-05-08', wastePickup: 149, wasteLoad: 210 },
  { date: '2024-05-09', wastePickup: 227, wasteLoad: 180 },
  { date: '2024-05-10', wastePickup: 293, wasteLoad: 330 },
  { date: '2024-05-11', wastePickup: 335, wasteLoad: 270 },
  { date: '2024-05-12', wastePickup: 197, wasteLoad: 240 },
  { date: '2024-05-13', wastePickup: 197, wasteLoad: 160 },
  { date: '2024-05-14', wastePickup: 448, wasteLoad: 490 },
  { date: '2024-05-15', wastePickup: 473, wasteLoad: 380 },
  { date: '2024-05-16', wastePickup: 338, wasteLoad: 400 },
  { date: '2024-05-17', wastePickup: 499, wasteLoad: 420 },
  { date: '2024-05-18', wastePickup: 315, wasteLoad: 350 },
  { date: '2024-05-19', wastePickup: 235, wasteLoad: 180 },
  { date: '2024-05-20', wastePickup: 177, wasteLoad: 230 },
  { date: '2024-05-21', wastePickup: 82, wasteLoad: 140 },
  { date: '2024-05-22', wastePickup: 81, wasteLoad: 120 },
  { date: '2024-05-23', wastePickup: 252, wasteLoad: 290 },
  { date: '2024-05-24', wastePickup: 294, wasteLoad: 220 },
  { date: '2024-05-25', wastePickup: 201, wasteLoad: 250 },
  { date: '2024-05-26', wastePickup: 213, wasteLoad: 170 },
  { date: '2024-05-27', wastePickup: 420, wasteLoad: 460 },
  { date: '2024-05-28', wastePickup: 233, wasteLoad: 190 },
  { date: '2024-05-29', wastePickup: 78, wasteLoad: 130 },
  { date: '2024-05-30', wastePickup: 340, wasteLoad: 280 },
  { date: '2024-05-31', wastePickup: 178, wasteLoad: 230 },
  { date: '2024-06-01', wastePickup: 178, wasteLoad: 200 },
  { date: '2024-06-02', wastePickup: 470, wasteLoad: 410 },
  { date: '2024-06-03', wastePickup: 103, wasteLoad: 160 },
  { date: '2024-06-04', wastePickup: 439, wasteLoad: 380 },
  { date: '2024-06-05', wastePickup: 88, wasteLoad: 140 },
  { date: '2024-06-06', wastePickup: 294, wasteLoad: 250 },
  { date: '2024-06-07', wastePickup: 323, wasteLoad: 370 },
  { date: '2024-06-08', wastePickup: 385, wasteLoad: 320 },
  { date: '2024-06-09', wastePickup: 438, wasteLoad: 480 },
  { date: '2024-06-10', wastePickup: 155, wasteLoad: 200 },
  { date: '2024-06-11', wastePickup: 92, wasteLoad: 150 },
  { date: '2024-06-12', wastePickup: 492, wasteLoad: 420 },
  { date: '2024-06-13', wastePickup: 81, wasteLoad: 130 },
  { date: '2024-06-14', wastePickup: 426, wasteLoad: 380 },
  { date: '2024-06-15', wastePickup: 307, wasteLoad: 350 },
  { date: '2024-06-16', wastePickup: 371, wasteLoad: 310 },
  { date: '2024-06-17', wastePickup: 475, wasteLoad: 520 },
  { date: '2024-06-18', wastePickup: 107, wasteLoad: 170 },
  { date: '2024-06-19', wastePickup: 341, wasteLoad: 290 },
  { date: '2024-06-20', wastePickup: 408, wasteLoad: 450 },
  { date: '2024-06-21', wastePickup: 169, wasteLoad: 210 },
  { date: '2024-06-22', wastePickup: 317, wasteLoad: 270 },
  { date: '2024-06-23', wastePickup: 480, wasteLoad: 530 },
  { date: '2024-06-24', wastePickup: 132, wasteLoad: 180 },
  { date: '2024-06-25', wastePickup: 141, wasteLoad: 190 },
  { date: '2024-06-26', wastePickup: 434, wasteLoad: 380 },
  { date: '2024-06-27', wastePickup: 448, wasteLoad: 490 },
  { date: '2024-06-28', wastePickup: 149, wasteLoad: 200 },
  { date: '2024-06-29', wastePickup: 103, wasteLoad: 160 },
  { date: '2024-06-30', wastePickup: 446, wasteLoad: 400 },
];

const COLOR_ONE = '#38e8b6';
const COLOR_TWO = '#ff4d6d';

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  wastePickup: {
    label: 'Waste Pickup',
    color: COLOR_ONE,
  },
  wasteLoad: {
    label: 'Waste Load',
    color: COLOR_TWO,
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
          <CardTitle>Waste - Load / Pickup</CardTitle>
          <CardDescription>
            Showing total waste load and pickup distribution over time.
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
              <linearGradient id='fillWastePickup' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor={COLOR_ONE} stopOpacity={0.8} />
                <stop offset='95%' stopColor={COLOR_ONE} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id='fillWasteLoad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor={COLOR_TWO} stopOpacity={0.8} />
                <stop offset='95%' stopColor={COLOR_TWO} stopOpacity={0.1} />
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
              dataKey='wasteLoad'
              type='natural'
              fill='url(#fillWasteLoad)'
              stroke={COLOR_TWO}
              stackId='a'
            />
            <Area
              dataKey='wastePickup'
              type='natural'
              fill='url(#fillWastePickup)'
              stroke={COLOR_ONE}
              stackId='a'
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
