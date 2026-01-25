import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Forge, Forger, useForge } from "@/lib/forge";
import {
  TextArea,
  TextFileUploader,
  TextInput,
  TextSelect,
} from "@/components/layouts/FormInputs";
import { CloudUpload } from "lucide-react";

type Props = {
  trigger: React.ReactNode;
};

const CreateChangeDialog: React.FC<Props> = ({ trigger }) => {
  const { control } = useForge({
    defaultValues: {
      changeName: "",
      changeType: "",
      amount: "",
      urgency: "",
      description: "",
      files: null,
    },
  });

  const handleSubmit = (data: {
    changeName: string;
    changeType: string;
    amount: string;
    urgency: string;
    description: string;
    files: File[] | null;
  }) => {
    void data;
  };

  const FileListItem = ({ file, control }: { file: File; control: unknown }) => {
    void control;
    return <div className="hidden">{file.name}</div>;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        <div className="flex items-center justify-between px-8 pt-8">
          <DialogTitle className="text-xl font-semibold text-[#0F0F0F]">
            Create Change
          </DialogTitle>
        </div>
        <div className="px-8 pb-8 pt-6">
          <Forge control={control} onSubmit={handleSubmit} className="space-y-5">
            <Forger
              name="changeName"
              label="Change Name"
              placeholder="Enter Title"
              component={TextInput}
            />
            <Forger
              name="changeType"
              label="Change Type"
              placeholder="Change Proposal"
              component={TextSelect}
              options={[
                { label: "Change Request", value: "request" },
                { label: "Change Order", value: "order" },
                { label: "Change Directive", value: "directive" },
                { label: "Change Proposal", value: "proposal" },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="amount"
                label="Amount"
                placeholder="Change Proposal"
                component={TextInput}
              />
              <Forger
                name="urgency"
                label="Level of Urgency"
                placeholder="High"
                component={TextSelect}
                options={[
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                  { label: "Low", value: "low" },
                ]}
              />
            </div>
            <Forger
              name="description"
              label="Description"
              placeholder="Enter Detail"
              component={TextArea}
              rows={5}
            />
            <Forger
              name="files"
              label="Upload Files"
              component={TextFileUploader}
              element={
                <div className="flex flex-col items-center gap-3">
                  <CloudUpload className="h-12 w-12 text-[#2A4467]" />
                  <div className="space-y-1 text-center">
                    <p className="text-base font-semibold text-[#2A4467]">
                      Drag & Drop or Click to choose files
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      Supported formats: DOC, PDF, XLS, XLSLS, ZIP, PNG, JPEG
                    </p>
                  </div>
                </div>
              }
              List={FileListItem}
              className="rounded-xl border border-dashed border-[#2A4467]"
              accept={
                {
                  "application/pdf": [".pdf"],
                  "application/msword": [".doc"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                    ".docx",
                  ],
                  "application/vnd.ms-excel": [".xls"],
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                    ".xlsx",
                  ],
                  "application/zip": [".zip"],
                  "image/png": [".png"],
                  "image/jpeg": [".jpeg", ".jpg"],
                } as any
              }
            />
            <div className="flex items-center gap-4 pt-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 rounded-xl border-[#E5E7EB] bg-[#F3F4F6] text-base font-semibold text-[#0F0F0F] hover:bg-[#E5E7EB]"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="h-12 flex-1 rounded-xl bg-[#2A4467] text-base font-semibold text-white hover:bg-[#1f3552]"
              >
                Send Request
              </Button>
            </div>
          </Forge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChangeDialog;
