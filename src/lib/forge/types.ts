/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ReactNode, RefObject } from "react";
import { Accept } from "react-dropzone";
import {
  Control,
  DefaultValues,
  FieldValues,
  Path,
  RegisterOptions,
  Resolver,
  UseFormReturn,
} from "react-hook-form";

export type FormPropsRef = {
  onSubmit: () => void;
};

export type ForgeControl<
  T extends FieldValues,
  TFieldProps = unknown
> = Control<T, any> & {
  fields?: FieldProps<TFieldProps>[];
  hasFields: boolean;
};

type AsyncDefaultValues<TFieldValues> = (
  payload?: unknown
) => Promise<TFieldValues>;

export type ForgerProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "name"
> & {
  name: Path<TFieldValues>;
  component: any;
  label?: string | JSX.Element;
  onChange?: (value: string) => void;
  accept?: Accept;
  multiple?: boolean;
  control?: ForgeControl<TFieldValues>;
} & Record<string, any>;

export type ForgerControllerProps<
  TFieldValues extends FieldValues = FieldValues
> = {
  name: Path<TFieldValues>;
  className?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, any>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  transform?: {
    input?: (value: string) => string;
    output?: (val: string) => string;
  };
  component: Component<ForgerSlotProps>;
  handler?: string;
  methods: UseFormReturn<TFieldValues>;
  dependencies?: any[];
} & Record<string, any>;

export type ForgerSlotProps = {
  name: string;
  error: string;
  value: string;
  placeholder?: string;
  control: ForgeControl<FieldValues>;
  onBlur: RegisterOptions["onBlur"];
  onChange: RegisterOptions["onChange"];
};

export type TForgerProps = {
  name: string;
  component: typeof Component<ForgerSlotProps> | any;
  label?: string;
};

export type FieldProps<
  TFieldProps = unknown,
  TFieldValues extends FieldValues = FieldValues
> = ForgerProps<TFieldValues> & TFieldProps;

export type UseForgeProps<
  TFieldProps = unknown,
  TFieldValues extends FieldValues = FieldValues
> = {
  defaultValues?:
    | AsyncDefaultValues<TFieldValues>
    | DefaultValues<TFieldValues>
    | undefined;
  resolver?: Resolver<TFieldValues>;
  fields?: FieldProps<TFieldProps>[];
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
};

export type UseForgeResult<T extends FieldValues, TFieldProps = unknown> = Omit<
  UseFormReturn<T>,
  "control"
> & {
  control: ForgeControl<T, TFieldProps>;
};

export type ForgeProps<
  TFieldValues extends FieldValues,
  TFieldProps = unknown
> = {
  onSubmit: (submit: TFieldValues) => void;
  className?: string;
  children?: ReactNode;
  control: ForgeControl<TFieldValues, TFieldProps>;
  ref?: RefObject<FormPropsRef | null>;
  isNative?: boolean;
  debug?: boolean
};
