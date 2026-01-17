import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import SendApprovalDialog from "./SendApprovalDialog";
import MessageComposer from "@/pages/SolicitationManagementPage/components/MessageComposer";

type Props = { trigger: React.ReactNode };

const LabelRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) => (
  <div className="grid grid-cols-2 gap-3 py-2">
    <span className="text-sm text-slate-500">{label}</span>
    <span
      className={`text-sm ${
        highlight ? "font-semibold text-slate-900" : "text-slate-800"
      }`}
    >
      {value}
    </span>
  </div>
);

const DocCard = ({
  name,
  type,
  size,
}: {
  name: string;
  type: string;
  size: string;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
    <div className="flex items-center justify-center h-10 w-10 rounded bg-slate-100" />
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-900">{name}</p>
      <p className="text-xs text-slate-500">
        {type} • {size}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" aria-label="Preview" />
      <Button variant="ghost" size="icon" aria-label="Download" />
    </div>
  </div>
);

const ChangeDetailsSheet: React.FC<Props> = ({ trigger }) => {
  const [isSending, setIsSending] = React.useState(false);
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="sm:max-w-2xl lg:max-w-3xl rounded-2xl"
        side="right"
      >
        <div className="space-y-6" data-testid="change-details-sheet">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>Change Details</SheetTitle>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </SheetHeader>

          <h3 className="text-lg font-semibold text-slate-900">
            Additional structural reinforcement
          </h3>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Separator />
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <LabelRow
                    label="Change Title"
                    value="Additional structural reinforcement"
                  />
                  <LabelRow label="Change Type" value="Request" />
                  <LabelRow label="Submission Date" value="April 30, 2025" />
                  <LabelRow
                    label="Submitted by"
                    value={
                      <a className="text-blue-600 underline">
                        Olamide Oladehinde
                      </a>
                    }
                  />
                </div>
                <div>
                  <LabelRow
                    label="Vendor/Contractor"
                    value={
                      <a className="text-blue-600 underline">Mike@acme.com</a>
                    }
                  />
                  <LabelRow label="Value" value="$2.50M" highlight />
                  <LabelRow
                    label="Status"
                    value={
                      <Badge className="bg-yellow-100 text-yellow-700">
                        Pending
                      </Badge>
                    }
                  />
                  <div className="py-2" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-slate-500">Description</span>
                <p className="text-sm text-slate-700">
                  Lorem ipsum dolor sit amet consectetur. Volutpat quis egestas
                  nunc egestas ut sed accumsan commodo vitae. Ullamcorper
                  feugiat pulvinar consectetur vel natoque amet enim ac sed.
                  Laoreet fringilla sollicitudin pharetra sit proin dictum. Sit
                  sed lorem mauris.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-sm text-slate-500">
                  Attached Documents
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <DocCard name="RFP_HRSoftware" type="DOC" size="25KB" />
                  <DocCard name="RFP_HRSoftware" type="PDF" size="1MB" />
                  <DocCard name="RFP_HRSoftware" type="DOC" size="25KB" />
                  <DocCard name="RFP_HRSoftware" type="PDF" size="1MB" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <div className="flex items-center justify-between">
                <div />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>All</DropdownMenuItem>
                    <DropdownMenuItem disabled>Unread</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator />

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-700">No comments yet.</p>
              </div>

              <MessageComposer
                onSend={(content) => {
                  console.log({ content });
                  setIsSending(true);
                  setTimeout(() => setIsSending(false), 600);
                }}
                isLoading={isSending}
                replyToUser={{ name: "Zenith Solution" }}
                currentUser={{ name: "You" }}
                sendType="reply"
                isNewChat={false}
                onSendTypeChange={() => {}}
              />
            </TabsContent>
          </Tabs>

          <SheetFooter>
            <div className="flex w-full gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-12 rounded-xl">
                Reject Change
              </Button>
              <SendApprovalDialog
                trigger={
                  <Button className="flex-1 h-12 rounded-xl">
                    Send for Approval
                  </Button>
                }
              />
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChangeDetailsSheet;
