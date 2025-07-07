import { ComponentProps, ComponentType } from "react";

export type CustomComponentType<T = unknown> = ComponentType<T>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Providers = {
  types: CustomComponentType<any>;
  props: ComponentProps<CustomComponentType<any>> | null | undefined;
  children?: Providers[];
};
