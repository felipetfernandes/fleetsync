"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A radar chart with a legend";

const chartConfig = {
  totalCostNormalized: {
    label: "Custo total",
    color: "#ff2056",
  },
  servicesNormalized: {
    label: "Ordens",
    color: "#0065F8",
  },
} satisfies ChartConfig;

export function CostByBranch({ chartData }) {
  const maxCost = Math.max(...chartData.map((d) => d.totalCost));
  const maxServices = Math.max(...chartData.map((d) => d.services));

  const normalizedData = chartData.map((d) => ({
    ...d,
    totalCostNormalized: (d.totalCost / maxCost) * 100,
    servicesNormalized: (d.services / maxServices) * 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-200">Ordens por filial</CardTitle>
        <CardDescription>
          Custo total e quantidade de ordens de serviço por filial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart
            data={normalizedData}
            margin={{
              top: -40,
              bottom: -10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelKey="branchName"
                  nameKey="dataKey"
                  labelFormatter={(_, payload) => {
                    const first = payload?.[0];
                    if (!first) return null;

                    return (
                      <span className="font-semibold text-sm text-foreground">
                        {first.payload.branchName}
                      </span>
                    );
                  }}
                  formatter={(_, name, item) => {
                    const original = item.payload;

                    const label =
                      name === "totalCostNormalized"
                        ? `R$ ${original.totalCost.toFixed(2)}`
                        : `${original.services}`;

                    return (
                      <>
                        <span className="text-muted-foreground">
                          {chartConfig[name].label}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {label}
                        </span>
                      </>
                    );
                  }}
                />
              }
            />
            <PolarAngleAxis dataKey="branchId" />
            <PolarGrid />
            <Radar
              dataKey="totalCostNormalized"
              fill="var(--color-totalCostNormalized)"
              fillOpacity={0.6}
            />
            <Radar
              dataKey="servicesNormalized"
              fill="var(--color-servicesNormalized)"
              fillOpacity={0.4}
            />
            <ChartLegend
              className="mt-8 text-gray-200"
              content={
                <ChartLegendContent
                  payload={[
                    {
                      value: chartConfig.totalCostNormalized.label,
                      color: chartConfig.totalCostNormalized.color,
                    },
                    {
                      value: chartConfig.servicesNormalized.label,
                      color: chartConfig.servicesNormalized.color,
                    },
                  ]}
                />
              }
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground leading-none">
        Exibindo o custo total e a quantidade de manutenções por filial
      </CardFooter>
    </Card>
  );
}
