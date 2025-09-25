"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

type MonthlyData = {
  month: string
  cost: number
  services: number
}

interface MonthlyMaintenanceProps {
  chartData: MonthlyData[]
}

const chartConfig = {
  cost: {
    label: "Cost",
    color: "#ff2056",
  },
  services: {
    label: "Services",
    color: "#00a6f4",
  },
} satisfies ChartConfig

export default function MonthlyMaintenance({ chartData }: MonthlyMaintenanceProps) {
  const hasEnoughData = chartData && chartData.length >= 2
  const lastMonth = chartData?.at(-1)
  const previousMonth = chartData?.at(-2)

  const costChange =
    hasEnoughData && lastMonth && previousMonth && previousMonth.cost !== 0
      ? Number((((lastMonth.cost - previousMonth.cost) / previousMonth.cost) * 100).toFixed(2))
      : 0

  const servicesChange =
    hasEnoughData && lastMonth && previousMonth && previousMonth.services !== 0
      ? Number((((lastMonth.services - previousMonth.services) / previousMonth.services) * 100).toFixed(2))
      : 0

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-200">Manutenções por mês</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis visibility={"hidden"} yAxisId="left" orientation="left" stroke="var(--color-cost)" />
            <YAxis visibility={"hidden"} yAxisId="right" orientation="right" stroke="var(--color-services)" />
            <Tooltip />
            <Line dataKey="cost" yAxisId="left" type="monotone" stroke="var(--color-cost)" strokeWidth={2} radius={2} />
            <Line
              dataKey="services"
              yAxisId="right"
              type="monotone"
              stroke="var(--color-services)"
              strokeWidth={2}
              radius={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm text-gray-200">
        <div className="flex gap-2 font-medium leading-none">
          {costChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {costChange + "% no custo de manutenções"}
        </div>
        <div className="flex gap-2 font-medium leading-none">
          {servicesChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {servicesChange + "% no volume de serviços"}
        </div>
        <div className="leading-none text-muted-foreground">Custo total e quantidade de manutenções por mês</div>
      </CardFooter>
    </Card>
  )
}
