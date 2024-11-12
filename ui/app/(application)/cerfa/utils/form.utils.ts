import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { get } from "lodash-es";
import { FieldValues, FormState, UseFormReturn } from "react-hook-form";
import { SetterOrUpdater } from "recoil";
import { CerfaField, CerfaForm, InformationMessage } from "shared/helpers/cerfa/types/cerfa.types";

import cerfaSchema, { indexedRules } from "./cerfaSchema";

export interface FieldState {
  state?: InputProps["state"];
  stateRelatedMessage?: string;
  informationMessages?: InformationMessage[];
  isAutocompleted?: boolean;
}

export const getFieldStateFromFormState = (
  formState: FormState<CerfaForm>,
  fieldsState: Record<string, FieldState | undefined>,
  name: string
): FieldState => {
  const error = get(formState.errors, name);

  const fieldState = get(fieldsState, name)?.state ?? "default";
  const fieldStateRelatedMessage = get(fieldsState, name)?.stateRelatedMessage;

  const state = error ? "error" : fieldState;
  const stateRelatedMessage = error?.message?.toString() || fieldStateRelatedMessage;

  return { state, stateRelatedMessage };
};

export const getFieldDeps = (name: string) => {
  const deps = indexedRules[name]?.map((control) => control.deps) ?? [];
  return Array.from(new Set(deps.flat()));
};

export const validateField = async (
  name: string,
  formValues: FieldValues,
  fieldMethods: UseFormReturn<FieldValues>,
  setFields: SetterOrUpdater<Record<string, FieldState | undefined>>
) => {
  const { setValue, resetField } = fieldMethods;
  const controls = indexedRules[name];
  let error: string | undefined = undefined;

  for (const control of controls ?? []) {
    const validation = await control.process({ values: formValues, fields: cerfaSchema.fields });

    if (validation?.error) {
      error = validation.error;
      setFields((fields) => ({ ...fields, [name]: { state: undefined, stateRelatedMessage: undefined } }));
    }

    if (validation?.cascade) {
      Object.entries(validation.cascade).forEach(([fieldName, cascade]) => {
        if (cascade?.informationMessages || cascade?.isAutocompleted || cascade?.success) {
          setFields((fields) => ({
            ...fields,
            ...(cascade.success
              ? { [fieldName]: { state: "success", stateRelatedMessage: cascade.stateRelatedMessage } }
              : {}),
            ...(cascade.informationMessages
              ? { [fieldName]: { informationMessages: cascade.informationMessages } }
              : {}),
            ...(cascade.isAutocompleted ? { [fieldName]: { isAutocompleted: cascade.isAutocompleted } } : {}),
          }));
        }
        if (cascade?.value) {
          const shouldValidate = cascade?.cascade ?? true;
          setValue(fieldName, cascade.value, { shouldValidate });
        }
        if (validation?.reset) {
          resetField(fieldName);
        }
      });
    }
  }

  return error;
};

export const downloadFile = (data: Blob, filename: string) => {
  // Step 5: Create a download link for the Blob
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;

  // Step 6: Set the download attribute and trigger the download
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Step 7: Clean up the temporary URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  // const a = document.createElement("a");
  // a.href = data;
  // a.download = filename;
  // a.click();

  return a;
};

export const getInformationMessageMarginTop = (fieldSchema: CerfaField) => {
  switch (fieldSchema.fieldType) {
    case "phone":
      return 7;
    case "consent":
      return 0;
    default:
      return 4;
  }
};
