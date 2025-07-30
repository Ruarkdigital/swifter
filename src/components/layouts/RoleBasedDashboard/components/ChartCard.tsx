import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardConfig } from "@/config/dashboardConfig";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/chartColorUtils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface ChartComponentProps {
  chart: DashboardConfig["rows"][0]["properties"][0];
  selected?: string;
  onFilterChange?: (filter: string) => void;
  chartData?: any; // Dynamic chart data based on individual filter
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  chart,
  selected,
  onFilterChange,
  chartData,
}) => {
  // Use dynamic chartData if provided, otherwise fallback to chart.data
  const data = chartData || chart.data;
  
  // Debug logging for chart data
  console.log(`[ChartComponent] Chart ID: ${chart.id}`);
  console.log(`[ChartComponent] Chart Title: ${chart.title}`);
  console.log(`[ChartComponent] chartData prop:`, chartData);
  console.log(`[ChartComponent] chart.data fallback:`, chart.data);
  console.log(`[ChartComponent] Final data being used:`, data);
  
  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  if (!chart.visible) return null;

  const renderChart = () => {
    switch (chart.type) {
      case "pie":
        return (
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx={chart.cx || "50%"}
                  cy={chart.cy || "50%"}
                  labelLine={chart.labelLine !== false}
                  outerRadius={chart.outerRadius || 80}
                  fill={chart.defaultFill || "#8884d8"}
                  dataKey="value"
                  startAngle={chart.startAngle || 0}
                  endAngle={chart.endAngle || 360}
                >
                  {data?.map((entry: any, index: number) => {
                    // Use consistent status-based colors
                    const color = getStatusColor(
                      entry.name, 
                      index, 
                      entry.color || chart.colors?.[entry.name]
                    );

                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Legend
                  layout={chart.legendLayout || "horizontal"}
                  verticalAlign={chart.legendPosition?.vertical || "bottom"}
                  align={chart.legendPosition?.horizontal || "center"}
                  iconType={chart.legendIconType || "rect"}
                  iconSize={10}
                  formatter={(_, __, index) => {
                    const item = data?.[index];
                    return (
                      <span className="ml-0.5 mr-2 items-center inline-block">
                        <span className="mr-2 text-gray-900 dark:text-gray-100">
                          {item.name}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {item.percentage || item.value}%
                        </span>
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case "donut":
        return (
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={chart?.innerRadius ?? 60}
                  outerRadius="80%"
                  dataKey="value"
                  label={false}
                >
                  {data?.map((entry: any, index: number) => {
                    const color = getStatusColor(
                      entry.name, 
                      index, 
                      entry.color
                    );
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                {chart.centerText && (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-900 dark:fill-gray-100"
                  >
                    <tspan
                      x="50%"
                      dy="-0.5em"
                      fontSize="24"
                      fontWeight="bold"
                      className="fill-gray-900 dark:fill-gray-100"
                    >
                      {chart.centerText.value}
                    </tspan>
                    <tspan
                      x="50%"
                      dy="1.5em"
                      fontSize="12"
                      className="fill-gray-500 dark:fill-gray-400 max-w-sm"
                    >
                      {chart.centerText.label}
                    </tspan>
                  </text>
                )}
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={10}
                  className="mb-2"
                  formatter={(_, __, index) => {
                    const item = data?.[index];
                    return (
                      <span className="ml-0.5 mr-2 items-center inline-block">
                        <span className="mr-2 text-gray-900 dark:text-gray-100 font-light">
                          {item.name}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 font-bold">
                          {item.value}%
                        </span>
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case "line":
        return (
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 7 }}
              >
                <XAxis
                  dataKey={Object.keys(data?.[0] || {})[0]}
                  tick={{ fill: "currentColor" }}
                  stroke="currentColor"
                  className="text-gray-500 dark:text-gray-400"
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  stroke="currentColor"
                  className="text-gray-500 dark:text-gray-400"
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                  vertical={chart.gridVertical !== false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend
                  verticalAlign={chart.legendPosition?.vertical || "bottom"}
                  align={chart.legendPosition?.horizontal || "center"}
                  iconType={chart.legendIconType || "circle"}
                  wrapperStyle={{ paddingTop: "10px" }}
                />
                {Object.keys(data?.[0] || {})
                  .slice(1)
                  .map((key, index) => {
                    // Use consistent status-based colors for lines
                    const color = getStatusColor(
                      key, 
                      index, 
                      chart.colors?.[key]
                    );

                    return (
                      <Line
                        key={key}
                        type={chart.lineType || "monotone"}
                        dataKey={key}
                        stroke={color}
                        strokeWidth={chart.strokeWidth || 2}
                        dot={{ r: chart.dotRadius || 0 }}
                        activeDot={{ r: chart.activeDotRadius || 6 }}
                        strokeDasharray={chart.strokeDasharray?.[key]}
                      />
                    );
                  })}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case "area":
        return (
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <AreaChart
                data={data}
                margin={{ top: 5, right: 30, left: 2, bottom: 7 }}
              >
                <XAxis
                  dataKey={Object.keys(data?.[0] || {})[0]}
                  tick={{ fill: "currentColor" }}
                  stroke="currentColor"
                  className="text-gray-500 dark:text-gray-400"
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  stroke="currentColor"
                  className="text-gray-500 dark:text-gray-400"
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                  vertical={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingTop: "10px" }}
                />
                {Object.keys(data?.[0] || {})
                  .slice(1)
                  .map((key, index) => {
                    // Dynamic color generation based on chart properties or default colors
                    const defaultColors = [
                      { stroke: "#3b82f6", fill: "rgba(59, 130, 246, 0.1)" }, // Blue
                      { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.1)" }, // Green
                      { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.1)" }, // Amber
                      { stroke: "#ef4444", fill: "rgba(239, 68, 68, 0.1)" }, // Red
                      { stroke: "#8b5cf6", fill: "rgba(139, 92, 246, 0.1)" }, // Purple
                      { stroke: "#06b6d4", fill: "rgba(6, 182, 212, 0.1)" }, // Cyan
                    ];

                    // Use chart-specific colors if available, otherwise use default colors
                    const colorIndex = index % defaultColors.length;
                    const color =
                      chart.colors?.[key] || defaultColors[colorIndex].stroke;
                    const fillColor =
                      chart.fillColors?.[key] || defaultColors[colorIndex].fill;

                    return (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={color}
                        strokeWidth={chart.strokeWidth || 2}
                        dot={{ r: chart.dotRadius || 0 }}
                        activeDot={{ r: chart.activeDotRadius || 6 }}
                        fill={fillColor}
                        fillOpacity={chart.fillOpacity || 0.5}
                      />
                    );
                  })}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case "bar":
        return (
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <BarChart
                data={data}
                layout={chart.layout || "horizontal"}
                margin={{
                  top: 5,
                  right: 10,
                  left: chart.layout === "horizontal" ? 30 : 30,
                  bottom: chart.layout === "horizontal" ? 5 : 10,
                }}
              >
                {chart.layout === "horizontal" ? (
                  <>
                    <XAxis
                      type="number"
                      tick={{ fill: "currentColor" }}
                      stroke="currentColor"
                      className="text-gray-500 dark:text-gray-400"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey={Object.keys(data?.[0] || {})[0]}
                      tick={{ fill: "currentColor", fontSize: 12 }}
                      stroke="currentColor"
                      className="text-gray-500 dark:text-gray-400"
                      axisLine={false}
                      tickLine={false}
                      width={70}
                    />
                  </>
                ) : (
                  <>
                    <XAxis
                      dataKey={Object.keys(data?.[0] || {})[0]}
                      tick={{ fill: "currentColor", fontSize: 12  }}
                      stroke="currentColor"
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <YAxis
                      tick={{ fill: "currentColor", fontSize: 12  }}
                      stroke="currentColor"
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </>
                )}
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                  vertical={
                    chart.layout === "horizontal"
                      ? true
                      : chart.gridVertical !== false
                  }
                  horizontal={chart.layout === "horizontal" ? false : true}
                />
                {chart.showLegend !== false && (
                  <Legend
                    verticalAlign={chart.legendPosition?.vertical || "bottom"}
                    align={chart.legendPosition?.horizontal || "center"}
                    iconType={chart.legendIconType || "rect"}
                    iconSize={10}
                  />
                )}
                <ChartTooltip content={<ChartTooltipContent />} />
                {Object.keys(data?.[0] || {})
                  .slice(1)
                  .map((key, index) => {
                    // Use consistent status-based colors for bars
                    const color = getStatusColor(
                      key, 
                      index, 
                      chart.colors?.[key]
                    );

                    return (
                      <Bar
                        key={key}
                        dataKey={key}
                        className={chart.barClassName || "rounded-md"}
                        barSize={
                          chart.barSize ||
                          (chart.layout === "horizontal" ? 20 : 30)
                        }
                        fill={color}
                        stackId={chart.stacked ? "stack" : undefined}
                        radius={
                          (chart.barRadius as [
                            number,
                            number,
                            number,
                            number
                          ]) ||
                          (chart.layout === "horizontal"
                            ? [0, 4, 4, 0]
                            : [4, 4, 0, 0])
                        }
                      />
                    );
                  })}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <Card className={cn("transition-colors", chart.className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{chart.title}</CardTitle>
        {chart.filters && chart.filters.length > 0 && (
          <div className="flex space-x-2 text-sm overflow-auto py-2">
            {chart.filters?.map((item) => {
              const isActive = selected?.replace(/\s+/g, "") === item.replace(/\s+/g, "");
              return (
                <Button
                  variant={isActive ? "default" : "ghost"}
                  key={item}
                  className={cn(
                    "transition-all duration-200 font-medium",
                  )}
                  onClick={() => onFilterChange?.(item)}
                >
                  {item}
                </Button>
              );
            })}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] w-full">{renderChart()}</div>
      </CardContent>
    </Card>
  );
};
