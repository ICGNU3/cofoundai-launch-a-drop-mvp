
import { useState, useCallback } from 'react';
import { validation, sanitize } from '@/utils/security';

interface FieldValidation {
  required?: boolean;
  type?: 'text' | 'email' | 'wallet' | 'number' | 'percentage';
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => { isValid: boolean; error?: string };
}

interface FormConfig {
  [key: string]: FieldValidation;
}

export const useSecureForm = <T extends Record<string, any>>(
  initialValues: T,
  config: FormConfig
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((name: keyof T, value: any): string | undefined => {
    const fieldConfig = config[name as string];
    if (!fieldConfig) return undefined;

    // Required validation
    if (fieldConfig.required && (!value || (typeof value === 'string' && value.trim().length === 0))) {
      return 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return undefined;
    }

    // Type-specific validation
    let result: { isValid: boolean; error?: string } = { isValid: true };

    switch (fieldConfig.type) {
      case 'text':
        result = validation.validateText(value, fieldConfig.maxLength);
        break;
      case 'email':
        result = validation.validateEmail(value);
        break;
      case 'wallet':
        result = validation.validateWalletAddress(value);
        break;
      case 'number':
        result = validation.validateNumber(value, fieldConfig.min, fieldConfig.max);
        break;
      case 'percentage':
        result = validation.validatePercentage(value);
        break;
    }

    if (!result.isValid) {
      return result.error;
    }

    // Custom validation
    if (fieldConfig.custom) {
      const customResult = fieldConfig.custom(value);
      if (!customResult.isValid) {
        return customResult.error;
      }
    }

    return undefined;
  }, [config]);

  const setValue = useCallback((name: keyof T, value: any) => {
    // Sanitize the value based on type
    let sanitizedValue = value;
    const fieldConfig = config[name as string];
    
    if (fieldConfig?.type === 'text' && typeof value === 'string') {
      sanitizedValue = sanitize.userInput(value);
    }

    setValues(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, sanitizedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [config, touched, validateField]);

  const setTouched = useCallback((name: keyof T) => {
    setTouchedState(prev => ({ ...prev, [name]: true }));
    
    // Validate when field is touched
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  const setTouchedState = setTouched;

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(config).forEach(fieldName => {
      const error = validateField(fieldName as keyof T, values[fieldName as keyof T]);
      if (error) {
        newErrors[fieldName as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [config, validateField, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};
