"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from "lodash";
import { isWeb, Slot } from "../utils";
import { memo } from "react";
import {
  FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { ForgerControllerProps, ForgerProps } from "../types";


const ForgerController = <TFieldValues extends FieldValues = FieldValues>(
  props: ForgerControllerProps<TFieldValues>
) => {
  const { rules, transform, methods, component, name, handler, ...rest } =
    props;
  const {
    field: { onBlur, onChange, value, ref },
    fieldState: { error },
  } = useController<TFieldValues>({ name, rules, control: methods?.control });
  const Component = component as any;

  const getTextTransform = (text: string) => {
    return typeof transform === "undefined" ? text : transform.output?.(text);
  };

  const getTransformedValue = (text: string) => {
    return typeof transform === "undefined" ? text : transform.input?.(text);
  };

  const handleTrigger = handler
    ? {
        [handler]: (value: string) => onChange(getTextTransform(value)),
        onChange: () => {},
      }
    : isWeb
    ? { onChange: (value: string) => onChange(getTextTransform(value)) }
    : {
        onChangeText: (value: string) => onChange(getTextTransform(value)),
        onChange: () => {},
      };

  return (
    <Component
      {...rest}
      ref={ref}
      name={name}
      onBlur={onBlur}
      error={error?.message}
      control={methods.control}
      value={getTransformedValue(value)}
      {...handleTrigger}
    />
  );
};

const MemorizeController = memo<ForgerControllerProps<FieldValues>>(
  (props) => <ForgerController {...props} />,
  (prev, next) => {
    const { methods, dependencies = [], ...others } = next;
    const { methods: _, dependencies: prevDependencies = [], ...rest } = prev;

    // Check if dependencies have changed
    if (dependencies.length > 0 && prevDependencies.length > 0) {
      const depsChanged = dependencies.some((dep, index) => 
        dep !== prevDependencies[index]
      );
      if (depsChanged) {
        return false; // Re-render if dependencies changed
      }
    }

    // Check if form state has changed
    if (_.formState?.isDirty !== methods.formState?.isDirty) {
      return false; // Re-render if form state changed
    }

    // Check if other props have changed
    if (!isEqual(rest, others)) {
      return false; // Re-render if other props changed
    }

    return true; // Don't re-render if nothing changed
  }
);

MemorizeController.displayName = "MemorizeController";

export const Forger = (props: ForgerProps<FieldValues>) => {
  const methods = useFormContext() ?? { control: props?.control };

  return (
    <Slot>
      <MemorizeController
        {...props}
        name={props.name}
        methods={methods}
        component={props.component}
      />
    </Slot>
  );
};
