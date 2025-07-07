/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Children,
  cloneElement,
  createElement,
  useImperativeHandle,
} from "react";
import { FieldValues, FormProvider } from "react-hook-form";
import { ForgeProps } from "../types";
import {
  isButtonSlot,
  isElementSlot,
  isInputSlot,
  isNestedSlot,
} from "../utils";
import { Forger } from "../Forger";
import { DevTool } from "@hookform/devtools";

export const Forge = <TFieldValues extends FieldValues = FieldValues>({
  className,
  children,
  onSubmit,
  control,
  ref,
  isNative,
  debug,
}: ForgeProps<TFieldValues>) => {
  // Recursive function to traverse and process the entire nested tree of children
  const processChildrenRecursively = (children: any, depth = 0): any => {
    // Prevent infinite recursion with a reasonable depth limit
    if (depth > 10) {
      return children;
    }

    return Children.map(children, (child) => {
      // Skip non-React elements (strings, numbers, null, undefined)
      if (!isElementSlot(child)) {
        return child;
      }

      // Handle button elements - attach form submit handler
      if (isButtonSlot(child)) {
        return cloneElement(child, {
          onClick: control.handleSubmit(onSubmit),
        } as any);
      }

      // Handle input elements in native mode - register with form control
      if (isInputSlot(child) && isNative) {
        return createElement((child as any).type, {
          ...{
            ...((child as any).props as any),
            ...control.register(((child as any).props as any).name),
            key: ((child as any).props as any).name,
          },
        });
      }

      // Get child's children for recursive processing
      const childChildren = ((child as any).props as any)?.children;
      
      // If this element has children, process them recursively
      if (childChildren) {
        const processedChildren = processChildrenRecursively(childChildren, depth + 1);
        
        // For nested container elements (div, section, main), use createElement to preserve structure
        if (isNestedSlot(child)) {
          return createElement((child as any).type, {
            ...{
              ...((child as any).props as any),
              children: processedChildren,
            },
          });
        }
        
        // For other elements with children, clone and update
        return cloneElement(child, {
          ...{ control },
          children: processedChildren,
        } as any);
      }

      // For leaf elements without children, just pass control prop
      return cloneElement(child, { control } as any);
    });
  };

  const updatedChildren = processChildrenRecursively(children);

  useImperativeHandle(
    ref,
    () => {
      return {
        onSubmit: () => {
          control.handleSubmit(onSubmit)()
        },
      };
    },
    [onSubmit, control]
  );

  const renderFieldProps = control.hasFields
    ? control?.fields?.map((inputs, index) => (
        <Forger key={index} {...inputs} />
      ))
    : null;

  return (
    <FormProvider
      {...(control as unknown as any)}
      control={control as unknown as any}
    >
      <div className={className}>
        {renderFieldProps}
        {updatedChildren}
      </div>
      {debug && <DevTool control={control} />}
    </FormProvider>
  );
};
