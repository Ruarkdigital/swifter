/* eslint-disable import/no-anonymous-default-export */
import {
  Field,
  FieldError,
  FieldValues,
  InternalFieldErrors,
  InternalNameSet,
  MaxType,
  Message,
  MinType,
  NativeFieldValue,
  appendErrors,
} from "react-hook-form";
import {
  INPUT_VALIDATION_RULES,
  get,
  getValidateError,
  getValueAndMessage,
  isCheckBoxInput,
  isEmptyObject,
  isFileInput,
  isHTMLElement,
  isMessage,
  isNullOrUndefined,
  isRadioInput,
  isRegex,
  isWeb,
  isReactNative,
  // isTextInput,
  // isPicker,
  // isSwitch,
  // isSlider,
} from "./utils";
import { isBoolean, isFunction, isObject, isString, isUndefined } from "lodash";

type RadioFieldResult = {
  isValid: boolean;
  value: number | string | null;
};

const defaultReturn: RadioFieldResult = {
  isValid: false,
  value: null,
};

export const getRadioValue = (options?: any[]): RadioFieldResult => {
  if (!Array.isArray(options)) return defaultReturn;
  
  if (isReactNative) {
    // React Native radio button handling
    return options.reduce(
      (previous, option): RadioFieldResult =>
        option && option.selected && !option.disabled
          ? {
              isValid: true,
              value: option.value,
            }
          : previous,
      defaultReturn
    );
  }
  
  // Web radio button handling
  return options.reduce(
    (previous, option): RadioFieldResult =>
      option && option.checked && !option.disabled
        ? {
            isValid: true,
            value: option.value,
          }
        : previous,
    defaultReturn
  );
};

type CheckboxFieldResult = {
  isValid: boolean;
  value: string | string[] | boolean | undefined;
};

const defaultResult: CheckboxFieldResult = {
  value: false,
  isValid: false,
};

const validResult = { value: true, isValid: true };

const getCheckboxValue = (
  options?: any[]
): CheckboxFieldResult => {
  if (!Array.isArray(options)) return defaultResult;
  
  if (isReactNative) {
    // React Native checkbox handling
    if (options.length > 1) {
      const values = options
        .filter((option) => option && option.selected && !option.disabled)
        .map((option) => option.value);
      return { value: values, isValid: !!values.length };
    }
    
    return options[0]?.selected && !options[0]?.disabled
      ? isUndefined(options[0].value) || options[0].value === ""
        ? validResult
        : { value: options[0].value, isValid: true }
      : defaultResult;
  }
  
  // Web checkbox handling
  if (options.length > 1) {
    const values = options
      .filter((option) => option && option.checked && !option.disabled)
      .map((option) => option.value);
    return { value: values, isValid: !!values.length };
  }

  return options[0]?.checked && !options[0]?.disabled
    ?
      options[0].attributes && !isUndefined(options[0].attributes.value)
      ? isUndefined(options[0].value) || options[0].value === ""
        ? validResult
        : { value: options[0].value, isValid: true }
      : validResult
    : defaultResult;
};

export default async <T extends FieldValues>(
  field: Field,
  formValues: T,
  validateAllFieldCriteria: boolean,
  shouldUseNativeValidation?: boolean,
  isFieldArray?: boolean,
  disabledFieldNames?: InternalNameSet,
): Promise<InternalFieldErrors> => {
  const {
    ref,
    refs,
    required,
    maxLength,
    minLength,
    min,
    max,
    pattern,
    validate,
    name,
    valueAsNumber,
    mount,
    disabled,
  } = field._f;
  const inputValue: NativeFieldValue = get(formValues, name);
  if (!mount || disabled || disabledFieldNames?.has(name)) {
    return {};
  }
  const inputRef: any = refs ? refs[0] : ref;
  const setCustomValidity = (message?: string | boolean) => {
    if (shouldUseNativeValidation) {
      if (isWeb && inputRef?.reportValidity) {
        inputRef.setCustomValidity(isBoolean(message) ? "" : message || "");
        inputRef.reportValidity();
      } else if (isReactNative && inputRef?.setNativeProps) {
        // React Native validation - set error state on component
        inputRef.setNativeProps({
          error: isBoolean(message) ? undefined : message || undefined
        });
      }
    }
  };
  const error: InternalFieldErrors = {};
  const isRadio = isRadioInput(ref);
  const isCheckBox = isCheckBoxInput(ref);
  const isRadioOrCheckbox = isRadio || isCheckBox;
  const isEmpty =
    ((valueAsNumber || isFileInput(ref)) &&
      isUndefined(ref.value) &&
      isUndefined(inputValue)) ||
    (isHTMLElement(ref) && ref.value === "") ||
    inputValue === "" ||
    (Array.isArray(inputValue) && !inputValue.length);
  const appendErrorsCurry = appendErrors.bind(
    null,
    name,
    validateAllFieldCriteria,
    error
  );
  const getMinMaxMessage = (
    exceedMax: boolean,
    maxLengthMessage: Message,
    minLengthMessage: Message,
    maxType: MaxType = INPUT_VALIDATION_RULES.maxLength,
    minType: MinType = INPUT_VALIDATION_RULES.minLength
  ) => {
    const message = exceedMax ? maxLengthMessage : minLengthMessage;
    error[name] = {
      type: exceedMax ? maxType : minType,
      message,
      ref,
      ...appendErrorsCurry(exceedMax ? maxType : minType, message),
    };
  };

  if (
    isFieldArray
      ? !Array.isArray(inputValue) || !inputValue.length
      : required &&
        ((!isRadioOrCheckbox && (isEmpty || isNullOrUndefined(inputValue))) ||
          (isBoolean(inputValue) && !inputValue) ||
          (isCheckBox && !getCheckboxValue(refs).isValid) ||
          (isRadio && !getRadioValue(refs).isValid))
  ) {
    const { value, message } = isMessage(required)
      ? { value: !!required, message: required }
      : getValueAndMessage(required);

    if (value) {
      error[name] = {
        type: INPUT_VALIDATION_RULES.required,
        message,
        ref: inputRef,
        ...appendErrorsCurry(INPUT_VALIDATION_RULES.required, message),
      };
      if (!validateAllFieldCriteria) {
        setCustomValidity(message);
        return error;
      }
    }
  }

  if (!isEmpty && (!isNullOrUndefined(min) || !isNullOrUndefined(max))) {
    let exceedMax;
    let exceedMin;
    const maxOutput = getValueAndMessage(max);
    const minOutput = getValueAndMessage(min);

    if (!isNullOrUndefined(inputValue) && !isNaN(inputValue as number)) {
      const valueNumber = isWeb && (ref as any)?.valueAsNumber
        ? (ref as any).valueAsNumber
        : (inputValue ? +inputValue : inputValue);
      if (!isNullOrUndefined(maxOutput.value)) {
        exceedMax = valueNumber > maxOutput.value;
      }
      if (!isNullOrUndefined(minOutput.value)) {
        exceedMin = valueNumber < minOutput.value;
      }
    } else {
      const valueDate = isWeb && (ref as any)?.valueAsDate
        ? (ref as any).valueAsDate
        : new Date(inputValue as string);
      const convertTimeToDate = (time: unknown) =>
        new Date(new Date().toDateString() + " " + time);
      const isTime = isWeb && (ref as any)?.type === "time";
      const isWeek = isWeb && (ref as any)?.type === "week";

      if (isString(maxOutput.value) && inputValue) {
        exceedMax = isTime
          ? convertTimeToDate(inputValue) > convertTimeToDate(maxOutput.value)
          : isWeek
          ? inputValue > maxOutput.value
          : valueDate > new Date(maxOutput.value);
      }

      if (isString(minOutput.value) && inputValue) {
        exceedMin = isTime
          ? convertTimeToDate(inputValue) < convertTimeToDate(minOutput.value)
          : isWeek
          ? inputValue < minOutput.value
          : valueDate < new Date(minOutput.value);
      }
    }

    if (exceedMax || exceedMin) {
      getMinMaxMessage(
        !!exceedMax,
        maxOutput.message,
        minOutput.message,
        INPUT_VALIDATION_RULES.max,
        INPUT_VALIDATION_RULES.min
      );
      if (!validateAllFieldCriteria) {
        setCustomValidity(error[name]!.message);
        return error;
      }
    }
  }

  if (
    (maxLength || minLength) &&
    !isEmpty &&
    (isString(inputValue) || (isFieldArray && Array.isArray(inputValue)))
  ) {
    const maxLengthOutput = getValueAndMessage(maxLength);
    const minLengthOutput = getValueAndMessage(minLength);
    const exceedMax =
      !isNullOrUndefined(maxLengthOutput.value) &&
      inputValue.length > +maxLengthOutput.value;
    const exceedMin =
      !isNullOrUndefined(minLengthOutput.value) &&
      inputValue.length < +minLengthOutput.value;

    if (exceedMax || exceedMin) {
      getMinMaxMessage(
        exceedMax,
        maxLengthOutput.message,
        minLengthOutput.message
      );
      if (!validateAllFieldCriteria) {
        setCustomValidity(error[name]!.message);
        return error;
      }
    }
  }

  if (pattern && !isEmpty && isString(inputValue)) {
    const { value: patternValue, message } = getValueAndMessage(pattern);

    if (isRegex(patternValue) && !inputValue.match(patternValue)) {
      error[name] = {
        type: INPUT_VALIDATION_RULES.pattern,
        message,
        ref,
        ...appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, message),
      };
      if (!validateAllFieldCriteria) {
        setCustomValidity(message);
        return error;
      }
    }
  }

  if (validate) {
    if (isFunction(validate)) {
      const result = await validate(inputValue, formValues);
      const validateError = getValidateError(result, inputRef);

      if (validateError) {
        error[name] = {
          ...validateError,
          ...appendErrorsCurry(
            INPUT_VALIDATION_RULES.validate,
            validateError.message
          ),
        };
        if (!validateAllFieldCriteria) {
          setCustomValidity(validateError.message);
          return error;
        }
      }
    } else if (isObject(validate)) {
      let validationResult = {} as FieldError;

      for (const key in validate) {
        if (!isEmptyObject(validationResult) && !validateAllFieldCriteria) {
          break;
        }

        const validateError = getValidateError(
          await validate[key](inputValue, formValues),
          inputRef,
          key
        );

        if (validateError) {
          validationResult = {
            ...validateError,
            ...appendErrorsCurry(key, validateError.message),
          };

          setCustomValidity(validateError.message);

          if (validateAllFieldCriteria) {
            error[name] = validationResult;
          }
        }
      }

      if (!isEmptyObject(validationResult)) {
        error[name] = {
          ref: inputRef,
          ...validationResult,
        };
        if (!validateAllFieldCriteria) {
          return error;
        }
      }
    }
  }

  setCustomValidity(true);
  return error;
};
