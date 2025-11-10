import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode, useState, useId, useEffect } from "react";
import { ForgerSlotProps } from "@/lib/forge/types";
import { Tag, TagInput } from "emblor";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CurrencyInput from "react-currency-input-field";

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string | JSX.Element;
  containerClass?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  name?: string;
  helperText?: string;
};

export type TextAreaProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  label?: string | JSX.Element;
  containerClass?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  rows?: number;
  name?: string;
  helperText?: string;
};

export type TextTagInputProps = {
  label?: string | JSX.Element;
  containerClass?: string;
  error?: string;
  name?: string;
  value?: Tag[];
  tags?: Tag[];
  ref?: React.Ref<HTMLInputElement>;
  helperText?: string;
};

export type TextDatePickerProps = {
  label?: string | JSX.Element;
  containerClass?: string;
  error?: string;
  name?: string;
  value?: Date;
  placeholder?: string;
  minDate?: Date;
  showTime?: boolean;
  maxDate?: Date;
  helperText?: string;
};

export type TextTimeInputProps = {
  label?: string | JSX.Element;
  containerClass?: string;
  error?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  helperText?: string;
};

// Forge-compatible TextInput component
export const TextInput = (props: TextInputProps & Partial<ForgerSlotProps>) => {
  const {
    label,
    containerClass,
    error,
    startAdornment,
    endAdornment,
    control,
    name,
    value,
    onChange,
    onBlur,
    helperText,
    ...inputProps
  } = props;

  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      {label && (
        <Label className="text-sm font-medium text-gray-700  mb-2">
          {label}
        </Label>
      )}
      <div className="relative">
        {startAdornment && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            {startAdornment}
          </span>
        )}
        <Input
          {...inputProps}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full h-12 border border-gray-300 rounded-lg px-4 focus:border-[#2A4467] focus:ring-[#2A4467] ${
            startAdornment ? "pl-10" : ""
          } ${endAdornment ? "pr-10" : ""} ${error ? "border-red-500" : ""}`}
        />
        {endAdornment && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            {endAdornment}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-gray-500 mt-1">{helperText}</span>
      )}
    </div>
  );
};

// Forge-compatible TextArea component
export const TextArea = (props: TextAreaProps & Partial<ForgerSlotProps>) => {
  const {
    label,
    containerClass,
    error,
    startAdornment,
    endAdornment,
    control,
    name,
    value,
    onChange,
    onBlur,
    rows = 4,
    helperText,
    ...textareaProps
  } = props;

  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      {label && (
        <Label className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </Label>
      )}
      <div className="relative">
        {startAdornment && (
          <span className="absolute left-3 top-3 z-10">{startAdornment}</span>
        )}
        <Textarea
          {...textareaProps}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          className={`w-full min-h-[120px] border border-gray-300 rounded-lg px-4 py-3 resize-none focus:border-[#2A4467] focus:ring-[#2A4467] dark:text-gray-200 ${
            startAdornment ? "pl-10" : ""
          } ${endAdornment ? "pr-10" : ""} ${error ? "border-red-500" : ""}`}
        />
        {endAdornment && (
          <span className="absolute right-3 top-3 z-10">{endAdornment}</span>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-gray-500 mt-1">{helperText}</span>
      )}
    </div>
  );
};

export const TextTagInput = (
  props: TextTagInputProps & Partial<ForgerSlotProps>
) => {
  const {
    label,
    containerClass,
    error,
    name,
    value = [],
    onChange,
    tags,
    ref,
    helperText,
  } = props;
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      {label && (
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </Label>
      )}
      <TagInput
        name={name}
        value={value}
        ref={ref}
        tags={tags ?? value}
        setTags={(newTags) => {
          onChange?.(newTags);
        }}
        placeholder="Add a tag"
        styleClasses={{
          inlineTagsContainer:
            "border-input rounded-lg bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 dark:border-slate-800 dark:bg-slate-950",
          input:
            "w-full min-w-[80px] shadow-none px-2 h-10 dark:text-slate-50 dark:placeholder:text-slate-400",
          tag: {
            body: "h-7 relative bg-background border border-input hover:bg-background !rounded-lg font-medium text-xs ps-3 pe-7 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-50",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground dark:text-slate-400 dark:hover:text-slate-50 dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-gray-500 mt-1">{helperText}</span>
      )}
    </div>
  );
};

// Forge-compatible TextDatePicker component
export const TextDatePicker = (
  props: TextDatePickerProps & Partial<ForgerSlotProps>
) => {
  const {
    label,
    containerClass,
    error,
    value,
    placeholder = "Pick a date",
    onChange,
    minDate,
    maxDate,
    showTime,
    helperText,
  } = props;
  const id = useId();
  const [timeValue, setTimeValue] = useState<string>(
    value ? format(value, "HH:mm") : ""
  );

  useEffect(() => {
    if (value) {
      setTimeValue(format(value, "HH:mm"));
    } else {
      setTimeValue("");
    }
  }, [value]);

  const combineDateTime = (date: Date | undefined, time: string) => {
    if (!date) return undefined;

    const [hours, minutes] = time.split(":").map(Number);

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      isNaN(hours) ? 0 : hours,
      isNaN(minutes) ? 0 : minutes,
      0,
      0
    );
  };

  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      {label && (
        <Label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </Label>
      )}
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant={"outline"}
            className={`group bg-background hover:bg-background border-gray-300 w-full h-12 justify-between px-4 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] focus:border-[#2A4467] focus:ring-[#2A4467] rounded-lg ${
              error ? "border-red-500" : ""
            }`}
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value ? format(value, showTime ? "PPP p" : "PPP") : placeholder}
            </span>
            <CalendarIcon
              size={16}
              className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 " align="start">
          <Calendar
            mode="single"
            selected={value}
            className={showTime ? "rounded-b-none" : ""}
            onSelect={(date) => {
              if (showTime) {
                const combined = combineDateTime(date, timeValue);
                onChange?.(combined);
              } else {
                onChange?.(date);
              }
            }}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
          />
          {showTime && (
            <TextTimeInput
              containerClass="rounded-t-none"
              className="!rounded-t-none"
              value={timeValue}
              onChange={(e) => {
                const newTime = e.target.value;
                setTimeValue(newTime);
                const combined = combineDateTime(value, newTime);
                onChange?.(combined);
              }}
            />
          )}
        </PopoverContent>
      </Popover>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-gray-500 mt-1">{helperText}</span>
      )}
    </div>
  );
};

// Forge-compatible TextTimeInput component
export const TextTimeInput = (
  props: TextTimeInputProps & Partial<ForgerSlotProps>
) => {
  const {
    label,
    containerClass,
    error,
    value,
    placeholder = "Select time",
    onChange,
    onBlur,
    name,
    className,
    helperText,
    ...inputProps
  } = props;
  const id = useId();

  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      {label && (
        <Label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          {...inputProps}
          id={id}
          type="time"
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full h-12 border border-gray-300 rounded-lg px-4 pr-10 focus:border-[#2A4467] focus:ring-[#2A4467] ${
            error ? "border-red-500" : ""
          } ${className}`}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-3">
          <ClockIcon size={16} aria-hidden="true" />
        </div>
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-gray-500 mt-1">{helperText}</span>
      )}
    </div>
  );
};

type TextCurrencyInputProps = Omit<TextInputProps, "onChange"> & {
  onChange: (value: number | string) => void;
};

export const TextCurrencyInput = (props: TextCurrencyInputProps) => {
  const {
    label,
    containerClass,
    error,
    startAdornment,
    endAdornment,
    name,
    value,
    onChange,
    onBlur,
    helperText,
    placeholder,
    className,
    id,
  } = props;

  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      {label && (
        <Label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </Label>
      )}
      <div className="relative">
        {startAdornment && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            {startAdornment}
          </span>
        )}
        <CurrencyInput
          // {...inputProps}
          id={id}
          name={name}
          value={value}
          onBlur={onBlur}
          decimalsLimit={2}
          prefix="$"
          defaultValue={1000}
          onValueChange={(value) => onChange?.(value ?? "")}
          placeholder={placeholder}
          className={`w-full h-12 border border-gray-300 rounded-lg px-4 pr-10 focus:border-[#2A4467] focus:ring-[#2A4467] ${
            error ? "border-red-500" : ""
          } ${className}`}
        />
        {endAdornment && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            {endAdornment}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-gray-500 mt-1">{helperText}</span>
      )}
    </div>
  );
};
