"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

type MonthlyData = {
  month: string;
  cost: number;
  services: number;
};

interface MonthlyMaintenanceProps {
  chartData: MonthlyData[];
}

const chartConfig = {
  cost: {
    label: "Cost",
    color: "#ee663a",
  },
  services: {
    label: "Services",
    color: "#ffdc96",
  },
} satisfies ChartConfig;

export default function MonthlyMaintenance({
  chartData,
}: MonthlyMaintenanceProps) {
  const costChange = Number(
    (
      ((chartData.at(-1).cost - chartData.at(-2).cost) /
        chartData.at(-2).cost) *
      100
    ).toFixed(2)
  );
  const servicesChange = Number(
    (
      ((chartData.at(-1).services - chartData.at(-2).services) /
        chartData.at(-2).services) *
      100
    ).toFixed(2)
  );

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-200">Manutenções por mês</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(-2)}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="var(--color-cost)"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-services)"
            />
            <Tooltip />
            <Bar
              dataKey="cost"
              yAxisId="left"
              fill="var(--color-cost)"
              radius={2}
            />
            <Bar
              dataKey="services"
              yAxisId="right"
              fill="var(--color-services)"
              radius={2}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm text-gray-200">
        <div className="flex gap-2 font-medium leading-none">
          {costChange > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {costChange + "% no custo de manutenções"}
        </div>
        <div className="flex gap-2 font-medium leading-none">
          {servicesChange > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {servicesChange + "% no volume de serviços"}
        </div>
        <div className="leading-none text-muted-foreground">
          Custo total e quantidade de manutenções por mês
        </div>
      </CardFooter>
    </Card>
  );
}
