import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "BuildCorp Ltd", value: 40 },
  { name: "TechServices Inc", value: 43 },
  { name: "Global Consulting", value: 35 },
  { name: "Equipment Supplier", value: 32 },
  { name: "Equipment Supplier", value: 31 },
  { name: "Equipment Supplier", value: 31 },
];

export const VendorsValueCard: React.FC = () => {
  return (
    <Card className="rounded-2xl border border-[#E5E7EB] shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[16px] font-semibold text-[#0F0F0F]">
            Contract Value by vendors
          </CardTitle>
          <div className="inline-flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-3 py-2">
            <span className="text-xs font-medium text-[#6B6B6B]">Top 10</span>
            <span className="inline-block w-3 h-3 rounded-sm bg-[#E5E7EB]" />
          </div>
        </div>
        <Tabs value="ytd" className="w-full">
          <TabsList className="bg-transparent p-0 gap-2">
            <TabsTrigger
              value="ytd"
              className="rounded-md px-3 py-2 text-sm font-semibold bg-[#F0F0F0] text-[#2A4467]"
            >
              YTD
            </TabsTrigger>
            {["12 months", "6 months", "3 months"].map((t) => (
              <TabsTrigger
                key={t}
                value={t.replace(/\s+/g, "")}
                className="rounded-md px-3 py-2 text-sm font-semibold text-[#667085]"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={{} as ChartConfig} className="aspect-[16/9]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#344054", fontSize: 12, fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Value ($M)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -5,
                  fill: "#344054",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#475467", fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                content={({ active, payload }) =>
                  active && payload && payload.length ? (
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-2 w-[140px] shadow">
                      <p className="text-[14px] font-medium text-[#0F0F0F]">
                        {payload[0].payload.name}
                      </p>
                      <p className="text-[12px] text-[#6B6B6B]">10 Contract</p>
                      <p className="text-[12px] text-[#6B6B6B]">
                        ${payload[0].value}M
                      </p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="value" fill="#286EE0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

