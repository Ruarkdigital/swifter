import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Item = {
  title: string;
  org: string;
  code: string;
  amount: string;
  note: string;
  color: string;
};

const items: Item[] = [
  {
    title: "AWS Cloud Services",
    org: "BlueCorp Industries",
    code: "CON-2024-001",
    amount: "$2.5M",
    note: "Expires in 30 days",
    color: "#DC2626",
  },
  {
    title: "AWS Cloud Services",
    org: "BlueCorp Industries",
    code: "CON-2024-001",
    amount: "$2.5M",
    note: "Expired 30 days ago",
    color: "#DC2626",
  },
  {
    title: "Office Lease Agreement",
    org: "BlueCorp Industries",
    code: "CON-2024-001",
    amount: "$1.2M",
    note: "Expires in 60 days",
    color: "#F59E0B",
  },
  {
    title: "Software Licenses",
    org: "BlueCorp Industries",
    code: "CON-2024-001",
    amount: "$0.8M",
    note: "Expires in 90 days",
    color: "#10B981",
  },
];

export const RenewalsTimelineCard: React.FC = () => {
  return (
    <Card className="rounded-2xl border border-[#E5E7EB] shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-[16px] font-semibold text-[#030712]">
          Renewals & Expiry Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-3 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-sm font-medium text-[#030712]">
                  {item.title}
                </p>
                <p className="text-xs text-[#6B6B6B]">
                  {item.org} • {item.code}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#030712]">
                {item.amount}
              </p>
              <p className="text-xs text-[#6B6B6B]">{item.note}</p>
            </div>
            <span className="inline-block w-3 h-3 rounded-sm bg-[#E5E7EB]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

