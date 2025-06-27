"use client";

import { Order } from "@/types/types";
import * as dfd from "danfojs"

function AreaChart(orders: Order[]) {
    const df = new dfd.DataFrame(orders);

  return <div>{JSON.stringify(df)}</div>;
}

export default AreaChart;
