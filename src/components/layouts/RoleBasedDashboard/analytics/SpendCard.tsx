import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  committed?: string;
  actual?: string;
  remaining?: string;
  utilizationPct?: number;
};

export const SpendCard: React.FC<Props> = ({
  committed = "$12.8M",
  actual = "$10.8M",
  remaining = "$2.2M",
  utilizationPct = 72,
}) => {
  const barWidth = (val: string) => {
    const num = Number(val.replace(/[^0-9.]/g, ""));
    const max = 12.8;
    return `${Math.min(100, Math.round((num / max) * 100))}%`;
  };

  return (
    <Card className="rounded-2xl border border-[#E5E7EB] shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-[16px] font-semibold text-[#030712]">
          Committed vs Actual Spend
        </CardTitle>
        <Tabs value="ytd" className="w-full">
          <TabsList className="bg-transparent p-0 gap-2">
            <TabsTrigger className="rounded-md px-3 py-2 text-sm font-semibold bg-[#F0F0F0] text-[#2A4467]" value="ytd">
              YTD
            </TabsTrigger>
            {["12 months", "6 months", "3 months"].map((t) => (
              <TabsTrigger key={t} value={t.replace(/\s+/g, "")} className="rounded-md px-3 py-2 text-sm font-semibold text-[#667085]">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        {/* Committed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-[#6B6B6B]">
              Committed Spend
            </p>
            <p className="text-[20px] font-bold text-[#0088FF]">{committed}</p>
          </div>
          <div className="w-full h-2.5 bg-[#DDDDDD] rounded-full overflow-hidden">
            <div
              className="h-2.5 bg-[#286EE0] rounded-full"
              style={{ width: barWidth(committed) }}
            />
          </div>
        </div>
        {/* Actual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-[#6B6B6B]">
              Actual Spend
            </p>
            <p className="text-[20px] font-bold text-[#43A047]">{actual}</p>
          </div>
          <div className="w-full h-2.5 bg-[#DDDDDD] rounded-full overflow-hidden">
            <div
              className="h-2.5 bg-[#43A047] rounded-full"
              style={{ width: barWidth(actual) }}
            />
          </div>
        </div>
        {/* Remaining budget */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[18px] font-semibold text-[#111827]">
              Remaining Budget
            </p>
            <p className="text-[16px] text-[#374151]">
              {utilizationPct}% of committed budget utilized
            </p>
          </div>
          <p className="text-[20px] font-bold text-[#43A047]">{remaining}</p>
        </div>
        {/* Performance callout */}
        <div className="rounded-2xl bg-[#EFF6FF] p-4">
          <p className="text-[18px] font-semibold text-[#111827]">
            Budget Performance
          </p>
          <p className="text-[16px] text-[#374151]">
            On track with projected spend rate
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
