import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { FillData } from "@/lib/store";

export default function FillGraph({ chartData }: { chartData: FillData }) {
  const chartConfig: ChartConfig = {
    fillLevel: {
      label: "Fill Level Over The Day",
      color: "hsl(var(--chart-1))",
    },
  }

  console.log(chartData);

  return <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="fillLevel"
          type="natural"
          fill="var(--color-fillLevel)"
          fillOpacity={0.4}
          stroke="var(--color-fillLevel)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
}