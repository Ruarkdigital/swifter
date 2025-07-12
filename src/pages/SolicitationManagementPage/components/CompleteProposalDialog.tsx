import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFieldArray, ForgeControl, Forger } from "@/lib/forge";
import { TextInput } from "../../../components/layouts/FormInputs/TextInput";
import { CornerDownRight, Plus, Trash2 } from "lucide-react";
import ProposalItemRow from "./ProposalItemRow";
import { FormValues } from "./SubmitProposalPage";
import { usePersist } from "@/lib/forge/usePersist/usePersist";
import { useState } from "react";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";

interface CompleteProposalDialogProps {
  open: boolean;
  id: string | null;
  onOpenChange: (open: boolean) => void;
  control: ForgeControl<FormValues>;
  reset?: () => void;
  setValue: UseFormSetValue<FormValues>;
  getValue: UseFormGetValues<FormValues>;
}

const CompleteProposalDialog: React.FC<CompleteProposalDialogProps> = ({
  id,
  open,
  onOpenChange,
  control,
  reset,
  setValue,
  getValue,
}) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "priceAction",
    inputProps: {},
    shouldUnregister: true,
  });

  const [totalAmount, setTotalAmount] = useState("0.00");

  // Calculate subtotal for an item (including its sub-items)
  const calculateItemSubtotal = (item: any) => {
    const mainSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
    const subItemsTotal = (item.subItems || []).reduce(
      (sum: number, subItem: any) => {
        return sum + (subItem.quantity || 0) * (subItem.unitPrice || 0);
      },
      0
    );
    return mainSubtotal + subItemsTotal;
  };

  // Calculate total amount from all items
  const calculateTotal = (formValues: any) => {
    if (!formValues?.priceAction) return 0;

    return formValues.priceAction.reduce((total: number, item: any) => {
      return total + calculateItemSubtotal(item);
    }, 0);
  };

  // Use usePersist to watch form changes and update calculations
  usePersist({
    control,
    handler: (formValues, formState) => {
      if (
        formValues?.priceAction &&
        (formState?.name?.includes("unitPrice") ||
          formState?.name?.includes("quantity"))
      ) {
        // Update subtotals for each item
        const updatedItems = formValues.priceAction.map((item: any) => {
          const itemSubtotal = calculateItemSubtotal(item);
          // Update sub-items subtotals
          const updatedSubItems = (item.subItems || []).map((subItem: any) => ({
            ...subItem,
            subtotal: (subItem.quantity || 0) * (subItem.unitPrice || 0),
          }));
          return {
            ...item,
            subtotal: itemSubtotal,
            subItems: updatedSubItems,
          };
        });

        // Update the form with calculated subtotals using update method
        // updatedItems.forEach((item: any, index: number) => {
        // });
        setValue("priceAction", updatedItems);

        // Calculate and set total
        const total = calculateTotal({ priceAction: updatedItems });
        setTotalAmount(total.toFixed(2));
        setValue("total", total);
      }
    },
  });

  const handleComplete = () => {
    setValue("document", [
      ...(getValue().document ?? []),
      { requiredDocumentId: id ?? "", files: [] },
    ]);
    onOpenChange(false);
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
    const currentItems = getValue().priceAction || [];
    // Remove the item using the remove function from useFieldArray
    remove(index);
    // check if there's subItems then delete also
    if (currentItems[index]?.subItems) {
      currentItems[index].subItems.forEach((_subItem: any, subItemIndex: number) => {
        control.unregister(`priceAction.${index}.subItems.${subItemIndex}.component`);
        control.unregister(`priceAction.${index}.subItems.${subItemIndex}.description`);
        control.unregister(`priceAction.${index}.subItems.${subItemIndex}.quantity`);
        control.unregister(`priceAction.${index}.subItems.${subItemIndex}.unitOfmeasurement`);
        control.unregister(`priceAction.${index}.subItems.${subItemIndex}.unitPrice`);
        control.unregister(`priceAction.${index}.subItems.${subItemIndex}.subtotal`);
      });
    }
    control.unregister(`priceAction.${index}.component`);
    control.unregister(`priceAction.${index}.description`);
    control.unregister(`priceAction.${index}.quantity`);
    control.unregister(`priceAction.${index}.unitOfmeasurement`);
    control.unregister(`priceAction.${index}.unitPrice`);
    control.unregister(`priceAction.${index}.subtotal`);

    // Recalculate total after removal
    const currentFormValues = getValue();
    const total = calculateTotal(currentFormValues);
    setTotalAmount(total.toFixed(2));
    setValue("total", total);
  };

  const addSubItem = (itemIndex: number) => {
    const currentItem = fields[itemIndex] as any;
    if (currentItem) {
      const updatedItem = {
        ...currentItem,
        subItems: [
          ...(currentItem.subItems || []),
          {
            component: "",
            description: "",
            quantity: 0,
            unitOfmeasurement: "",
            unitPrice: 0,
            subtotal: 0,
          },
        ],
      };
      update(itemIndex, updatedItem);
    }
  };

  const removeSubItem = (itemIndex: number, subItemIndex: number) => {
    const currentItems = getValue().priceAction || [];
    const updatedItems = [...currentItems];

    if (
      updatedItems[itemIndex]?.subItems &&
      Array.isArray(updatedItems[itemIndex].subItems) &&
      updatedItems[itemIndex].subItems.length > subItemIndex
    ) {
      // Remove the sub-item from the array
      updatedItems[itemIndex].subItems.splice(subItemIndex, 1);

      // Defensive: Ensure subItems is always an array
      updatedItems[itemIndex].subItems = updatedItems[itemIndex].subItems || [];

      // Recalculate the main item's subtotal
      const mainSubtotal =
        (updatedItems[itemIndex].quantity || 0) *
        (updatedItems[itemIndex].unitPrice || 0);
      const subItemsTotal = updatedItems[itemIndex].subItems.reduce(
        (sum: number, subItem: any) => {
          return sum + ((subItem?.quantity || 0) * (subItem?.unitPrice || 0));
        },
        0
      );
      updatedItems[itemIndex].subtotal = mainSubtotal + subItemsTotal;

      setValue("priceAction", updatedItems);
      control.unregister(`priceAction.${itemIndex}.subItems.${subItemIndex}.component`);
      control.unregister(`priceAction.${itemIndex}.subItems.${subItemIndex}.description`);
      control.unregister(`priceAction.${itemIndex}.subItems.${subItemIndex}.quantity`);
      control.unregister(`priceAction.${itemIndex}.subItems.${subItemIndex}.unitOfmeasurement`);
      control.unregister(`priceAction.${itemIndex}.subItems.${subItemIndex}.unitPrice`);
      control.unregister(`priceAction.${itemIndex}.subItems.${subItemIndex}.subtotal`);

      // Recalculate total
      const total = calculateTotal({ priceAction: updatedItems });
      setTotalAmount(total.toFixed(2));
      setValue("total", total);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Complete Proposal
          </DialogTitle>
          <DialogDescription>
            Add pricing details for your proposal items
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="col-span-1">#</div>
              <div className="col-span-2">Item/Component</div>
              <div className="col-span-2">Description</div>
              <div className="col-span-1">Quantity</div>
              <div className="col-span-2">Unit of Measurement</div>
              <div className="col-span-1">Unit Price</div>
              <div className="col-span-1">Subtotal</div>
              <div className="">Actions</div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  {/* Main Item Row */}
                  <ProposalItemRow
                    {...{ control }}
                    index={index}
                    onAddSubItem={addSubItem}
                    onRemoveItem={removeItem}
                  />

                  {/* Sub Items */}
                  {(field as any).subItems &&
                    (field as any).subItems!.length > 0 && (
                      <div className="ml-8 space-y-2">
                        {(field as any).subItems!.map(
                          (subItem: any, subIndex: any) => (
                            <div
                              key={subIndex}
                              className="grid grid-cols-12 gap-4 py-2"
                            >
                              <div className="col-span-1 flex items-center">
                                <CornerDownRight className="text-gray-400" />
                                {/* <div className="w-4 h-px bg-gray-400 mr-2"></div> */}
                              </div>
                              <div className="col-span-2">
                                <Forger
                                  name={`priceAction.${index}.subItems.${subIndex}.component`}
                                  component={TextInput}
                                  placeholder="Item/Component"
                                  className="h-8"
                                  control={control as any}
                                />
                              </div>
                              <div className="col-span-2">
                                <Forger
                                  name={`priceAction.${index}.subItems.${subIndex}.description`}
                                  value={subItem.description}
                                  placeholder="Description"
                                  component={TextInput}
                                  className="h-8"
                                  control={control as any}
                                />
                              </div>
                              <div className="col-span-1">
                                <Forger
                                  name={`priceAction.${index}.subItems.${subIndex}.quantity`}
                                  placeholder="Quantity"
                                  component={TextInput}
                                  className="h-8"
                                  control={control as any}
                                />
                              </div>
                              <div className="col-span-2">
                                <Forger
                                  name={`priceAction.${index}.subItems.${subIndex}.unitOfmeasurement`}
                                  placeholder="Unit of Measurement"
                                  component={TextInput}
                                  className="h-8"
                                  control={control as any}
                                />
                              </div>
                              <div className="col-span-1">
                                <Forger
                                  name={`priceAction.${index}.subItems.${subIndex}.unitPrice`}
                                  placeholder="Unit Price"
                                  component={TextInput}
                                  className="h-8"
                                  control={control as any}
                                />
                              </div>
                              <div className="col-span-1">
                                <Forger
                                  name={`priceAction.${index}.subItems.${subIndex}.subtotal`}
                                  component={TextInput}
                                  placeholder="Subtotal"
                                  className="h-8"
                                  disabled
                                  control={control as any}
                                />
                              </div>
                              <div className="col-span-1 flex items-center">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeSubItem(index, subIndex)}
                                  className="h-8 px-2 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Add More Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add More
              </Button>
            </div>

            {/* Total */}
            <div className="flex justify-end gap-6 items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ${totalAmount}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <DialogFooter className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  reset?.();
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-[#2A4467] hover:bg-[#1e3147]"
                onClick={handleComplete}
              >
                Complete Proposal
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProposalDialog;
