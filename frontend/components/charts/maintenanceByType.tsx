"use client";

import { PieChart, Pie, Cell, Label, Sector, Legend } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useMemo, useState } from "react";

type MaintenanceType = "PREVENTIVE" | "CORRECTIVE" | "PERIODIC";

type ChartDataItem = {
  type: MaintenanceType;
  totalCost: number;
  averageCost: number;
  quantity: number;
};

type DataType = {
  type: MaintenanceType;
  totalCost_sum: number;
  id_count: number;
};

interface MaintenanceByTypeProps {
  data: DataType[];
}

type PieActiveShapeProps = {
  cx: number;
  cy: number;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  fill: string;
  payload: ChartDataItem;
  percent: number;
  value: number;
  name?: string;
  index?: number;
};

const chartConfig = {
  PREVENTIVE: {
    label: "Preventiva",
    color: "#10b981",
  },
  CORRECTIVE: {
    label: "Correitiva",
    color: "#f59e0b",
  },
  PERIODIC: {
    label: "Periódica",
    color: "#4f46e5",
  },
} satisfies ChartConfig;

const COLORS = ["#10b981", "#f59e0b", "#4f46e5"];

const renderActiveShape = (props: unknown) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props as PieActiveShapeProps;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={-18}
        textAnchor={textAnchor}
        fill="oklch(55.1% 0.027 264.364)"
      >{`Média R$ ${payload.averageCost}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="oklch(96.7% 0.003 264.542)"
      >{`Total R$ ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="oklch(44.6% 0.03 256.802)"
      >
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

export default function MaintenanceByType({ data }: MaintenanceByTypeProps) {
  const chartData = data.map((item) => ({
    ...item,
    totalCost: Number(item.totalCost_sum.toFixed(0)),
    quantity: Number(item.id_count),
    averageCost: Number((item.totalCost_sum / item.id_count).toFixed(0)),
  }));

  const [activeType, setActiveType] = useState(chartData[0].type);

  const activeIndex = useMemo(
    () => chartData.findIndex((item) => item.type === activeType),
    [activeType, chartData]
  );

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-200">Tipos de Manutenção</CardTitle>
        <CardDescription>
          Custo e quantidade de manutenção por tipo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          id="maintenance-by-type"
          config={chartConfig}
          className="mx-auto aspect-square w-full h-96"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="totalCost"
              nameKey="type"
              innerRadius={50}
              outerRadius={90}
              strokeWidth={5}
              onClick={(data) => {
                setActiveType(data.name);
              }}
              label={renderActiveShape}
              labelLine={false}
            >
              {chartData.map(({ type }, index) => (
                <Cell key={`cell-${index}`} fill={chartConfig[type].color} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold"
                          fill="#f3f3f3"
                        >
                          {chartData[activeIndex].quantity.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                          fill="#f3f3f3"
                        >
                          Ordens
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
              <ChartLegend
                content={() => (
                  <ChartLegendContent
                    className="text-gray-200"
                    payload={chartData.map(({ type }) => ({
                      type,
                      dataKey: type,
                      color: chartConfig[type].color,
                    }))}
                    verticalAlign="bottom"
                  />
                )}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
