import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import PieChartCard from '@/app/user/_components/pie-chart-card';
import { BarChartOne } from '@/app/user/_components/BarChartOne';
import BarChartTwo from '@/app/user/_components/BarChartTwo';
export function SectionCards() {
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-2 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-2'>
      <PieChartCard />
      {/* <BarChartOne /> */}
      <BarChartTwo />
    </div>
  );
}
