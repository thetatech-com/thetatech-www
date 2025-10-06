import { createContext, useContext } from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

// Define the shape of the form context
 
interface FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  name: TName;
}

// Create the context with a default value
export const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

export const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

 
interface FormItemContextValue {
  id: string;
}
