"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Text,
  XAxis,
  YAxis,
} from "recharts";

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
import { OrderStatus } from "@/types/enums";

export const description = "A bar chart with a custom label";

type ChartDataType = {
  status: OrderStatus;
  cost: number;
  services: number;
  averageCost: number;
};

const chartConfig = {
  IN_PROGRESS: {
    label: "Em progresso",
    color: "#0065F8",
  },
  APPROVED: {
    label: "Aprovada",
    color: "#4f46e5",
  },
  PENDING: {
    label: "Pendente",
    color: "#E1BC29",
  },
  COMPLETED: {
    label: "Completa",
    color: "#3BB273",
  },
  CANCELLED: {
    label: "Cancelada",
    color: "#ff2056",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export default function ChartBarLabelCustom({
  chartData,
}: {
  chartData: ChartDataType[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-200">Manutenção por status</CardTitle>
        <CardDescription>
          Ordens de serviço por estatus com custo total
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="cost" type="number" hide />
            <ChartLegend
              content={() => (
                <ChartLegendContent
                  className="text-gray-200"
                  payload={chartData.map(({ status }) => ({
                    status,
                    color: chartConfig[status].color,
                  }))}
                  nameKey="status"
                  verticalAlign="bottom"
                />
              )}
            />
            <Bar dataKey="cost" name="cost" layout="vertical" radius={4}>
              {chartData.map(({ status }, index) => (
                <Cell
                  key={`cell-${index}`}
                  name={chartConfig[status].label}
                  fill={chartConfig[status].color}
                />
              ))}
              <LabelList
                dataKey="cost"
                position="insideLeft"
                offset={8}
                fontSize={12}
                content={({ value, x, y, height }) => (
                  <Text
                    x={x}
                    y={y + height / 2}
                    dx={10}
                    dy={6}
                    fill="#111827"
                    fontSize={12}
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    {`R$ ${Number(value).toFixed(2)}`}
                  </Text>
                )}
              />
              <LabelList
                dataKey="services"
                position="right"
                offset={-24}
                fill="#111827"
                fontWeight="bold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Exibindo o custo total e a quantidade de manutenções por status
        </div>
      </CardFooter>
    </Card>
  );
}
