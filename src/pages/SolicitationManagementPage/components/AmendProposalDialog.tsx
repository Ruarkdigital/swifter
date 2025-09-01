import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useFieldArray,
  ForgeControl,
  Forger,
  useForge,
  Forge,
} from "@/lib/forge";

import { Plus, Trash2, X } from "lucide-react";
import { usePersist } from "@/lib/forge/usePersist/usePersist";
import { UseFormSetValue, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRequest, putRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ProposalPriceAction interface based on API schema
interface ProposalPriceAction {
  component: string;
  description?: string;
  quantity: number;
  unitOfMeasurement: string;
  unitPrice: number;
  subtotal: number;
  subItems?: ProposalPriceAction[];
}

// Response interface for the API
interface ProposalPriceBreakdownResponse {
  message: string;
  data: ProposalPriceAction[];
}

// Form schema for amend proposal
const amendProposalSchema = yup.object().shape({
  reason: yup.string().required("Reason for amendment is required"),
  total: yup
    .number()
    .required("Total amount is required")
    .min(0, "Total must be positive"),
  priceAction: yup
    .array()
    .of(
      yup.object().shape({
        component: yup.string().required("Component is required"),
        description: yup.string().required("Description is required"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .min(0, "Quantity must be positive"),
        unitOfmeasurement: yup
          .string()
          .required("Unit of measurement is required"),
        unitPrice: yup
          .number()
          .required("Unit price is required")
          .min(0, "Unit price must be positive"),
        subtotal: yup.number().optional().min(0, "Subtotal must be positive"),
        subItems: yup
          .array()
          .of(
            yup.object().shape({
              component: yup.string().required("Sub-component is required"),
              description: yup.string().required("Sub-description is required"),
              quantity: yup
                .number()
                .required("Sub-quantity is required")
                .min(0, "Sub-quantity must be positive"),
              unitOfmeasurement: yup
                .string()
                .required("Sub-unit of measurement is required"),
              unitPrice: yup
                .number()
                .required("Sub-unit price is required")
                .min(0, "Sub-unit price must be positive"),
              subtotal: yup
                .number()
                .required("Sub-subtotal is required")
                .min(0, "Sub-subtotal must be positive"),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export type AmendProposalFormValues = yup.InferType<typeof amendProposalSchema>;

interface AmendProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string;
}

const AmendProposalDialog: React.FC<AmendProposalDialogProps> = ({
  open,
  onOpenChange,
  proposalId,
}) => {
  const [totalAmount, setTotalAmount] = useState("0.00");
  const toastHandlers = useToastHandler();

  // Initialize form with forge
  const forge = useForge<AmendProposalFormValues>({
    resolver: yupResolver(amendProposalSchema),
    defaultValues: {
      reason: "",
      total: 0,
      priceAction: [],
    },
  });

  const { control, setValue, getValues, reset } = forge;

  // Fetch existing proposal price breakdown data
  const { data: priceBreakdownData, isLoading } = useQuery<
    ApiResponse<ProposalPriceBreakdownResponse>,
    ApiResponseError
  >({
    queryKey: ["proposal-price-breakdown", proposalId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/procurement/evaluations/proposal/${proposalId}`,
      });
      return response;
    },
    enabled: open && !!proposalId,
  });
  const priceAction = priceBreakdownData?.data?.data;

  // Initialize form with existing data when loaded
  useEffect(() => {
    if (priceAction && Array.isArray(priceAction)) {
      const priceActionData = priceAction.map(
        (action: ProposalPriceAction) => ({
          component: action.component || "",
          description: action.description || "",
          quantity: action.quantity || 0,
          unitOfmeasurement: action.unitOfMeasurement || "",
          unitPrice: action.unitPrice || 0,
          subtotal:
            action.subtotal || (action.quantity || 0) * (action.unitPrice || 0),
          subItems: action.subItems || [],
        })
      );

      const total = calculateTotal({ priceAction: priceActionData });

      reset({
        reason: "",
        total: total,
        priceAction: priceActionData,
      });

      setTotalAmount(total.toFixed(2));
    }
  }, [priceAction, reset]);

  // Use persist to auto-calculate totals
  usePersist({
    control,
    handler: (data, state) => {
      if (data.priceAction && state.type === "change") {
        // Recalculate main item subtotals
        const updatedPriceAction = data.priceAction.map((item: any) => ({
          ...item,
          subtotal:
            (parseFloat(item.quantity) || 0) *
            (parseFloat(item.unitPrice) || 0),
        }));

        // Update form with recalculated subtotals
        setValue("priceAction", updatedPriceAction);

        // Calculate and set total
        const total = calculateTotal({ priceAction: updatedPriceAction });
        setTotalAmount(total.toFixed(2));
        setValue("total", total);
      }
    },
  });

  // Amendment mutation
  const { mutateAsync: amendProposal, isPending: isAmending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    AmendProposalFormValues
  >({
    mutationFn: async (amendData) => {
      // Transform price action data to match API expectations
      const payload = {
        reason: amendData.reason,
        files: [
          {
            name: "pricing-amendment.json",
            url: "", // This would typically be generated by a file upload
            size: "1024",
            type: "application/json",
          },
        ],
        priceAction: amendData.priceAction,
        total: amendData.total,
      };

      return await putRequest({
        url: `/procurement/solicitations/proposals/${proposalId}/pricing-submissions`,
        payload: payload,
      });
    },
    onSuccess: () => {
      toastHandlers.success("Success", "Proposal pricing amended successfully");
      onOpenChange(false);
      reset();
    },
    onError: (error: ApiResponseError) => {
      toastHandlers.error(
        "Error",
        error.message || "Failed to amend proposal pricing"
      );
    },
  });

  const handleSubmit = async () => {
    const formData = getValues();
    await amendProposal(formData);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Amend Proposal Pricing</DialogTitle>
            <DialogDescription>
              Loading existing proposal data...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Amend Submission
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Forge control={control} onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* File to Amend */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                File to Amend
              </label>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pricing
              </div>
            </div>

            {/* Pricing Table */}
            <PricingTable
              {...{ control, totalAmount, setTotalAmount, setValue }}
            />

            {/* Reason / Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason / Note *
              </label>
              <Forger
                name="reason"
                placeholder="Enter reason for amendment..."
                component={Textarea}
                control={control}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isAmending}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isAmending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAmending ? "Amending..." : "Amend"}
            </Button>
          </DialogFooter>
        </Forge>
      </DialogContent>
    </Dialog>
  );
};

export default AmendProposalDialog;

interface PricingTableProps {
  control: ForgeControl<AmendProposalFormValues>;
  totalAmount: string;
  setTotalAmount: (amount: string) => void;
  setValue: UseFormSetValue<AmendProposalFormValues>;
}

const PricingTable: React.FC<PricingTableProps> = ({
  control,
  totalAmount,
  setTotalAmount,
  setValue,
}) => {
  // Use field array for price actions
  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceAction",
    inputProps: {},
  });

  // Watch the entire priceAction array for real-time calculations
  const watchedPriceActions = useWatch({ control, name: "priceAction" });

  // Function to calculate subtotal for a specific item
  const calculateItemSubtotal = (index: number) => {
    const quantity = watchedPriceActions?.[index]?.quantity || 0;
    const unitPrice = watchedPriceActions?.[index]?.unitPrice || 0;
    return (quantity * unitPrice).toFixed(2);
  };

  const addItem = () => {
    append({
      component: "",
      description: "",
      quantity: 0,
      unitOfmeasurement: "",
      unitPrice: 0,
      subtotal: 0,
      subItems: [],
    });
  };

  const removeItem = (index: number) => {
    remove(index);

    // Recalculate total after removal
    const updatedItems = watchedPriceActions || [];
    const total = calculateTotal(
      { priceAction: updatedItems },
      watchedPriceActions
    );
    setTotalAmount(total.toFixed(2));
    setValue("total", total);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-gray-600">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Item/Component</div>
          <div className="col-span-2">Description</div>
          <div className="col-span-1">Quantity</div>
          <div className="col-span-2">Unit of Measurement</div>
          <div className="col-span-2">Unit Price</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Price Action Items */}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-3 items-center py-2"
          >
            <div className="col-span-1">
              <span className="text-sm font-medium">{index + 1}</span>
            </div>
            <div className="col-span-2">
              <Forger
                name={`priceAction.${index}.component`}
                placeholder="Item 2"
                component={Input}
                className="h-9 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Forger
                name={`priceAction.${index}.description`}
                placeholder="xyz Item"
                component={Input}
                className="h-9 text-sm"
              />
            </div>
            <div className="col-span-1">
              <Forger
                name={`priceAction.${index}.quantity`}
                placeholder="Enter Value"
                component={Input}
                className="h-9 text-sm"
                type="number"
              />
            </div>
            <div className="col-span-2">
              <Forger
                name={`priceAction.${index}.unitOfmeasurement`}
                placeholder="Enter Value"
                component={Input}
                className="h-9 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Forger
                name={`priceAction.${index}.unitPrice`}
                placeholder="Enter Value"
                component={Input}
                className="h-9 text-sm"
                type="number"
                step="0.01"
              />
            </div>
            <div className="col-span-1">
              <div className="h-9 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm flex items-center">
                {calculateItemSubtotal(index)}
              </div>
            </div>
            <div className="col-span-1 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add More Button */}
        <div className="flex justify-start pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addItem}
            className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add More
          </Button>
        </div>

        {/* Total */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {totalAmount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calculate total function
const calculateTotal = (data?: { priceAction?: any[] }, values?: any) => {
  const priceActions = data?.priceAction || values.priceAction || [];
  return priceActions.reduce((total: number, item: any) => {
    const itemSubtotal = parseFloat(item.subtotal) || 0;
    const subItemsTotal = (item.subItems || []).reduce(
      (subTotal: number, subItem: any) => {
        return subTotal + (parseFloat(subItem.subtotal) || 0);
      },
      0
    );
    return total + itemSubtotal + subItemsTotal;
  }, 0);
};
