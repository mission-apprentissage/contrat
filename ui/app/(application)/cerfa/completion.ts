import { get } from "lodash-es";
import { apprentiSchema } from "shared/helpers/cerfa/schema/apprentiSchema";
import { contratSchema } from "shared/helpers/cerfa/schema/contratSchema";
import { employeurSchema } from "shared/helpers/cerfa/schema/employeurSchema";
import { formationSchema } from "shared/helpers/cerfa/schema/formationSchema";
import { maitreApprentissageSchema } from "shared/helpers/cerfa/schema/maitreApprentissageSchema";
import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

export const getFormStatus = ({ errors }: CerfaForm) => {
  const contratStatus = getContratCompletion(Object.keys(contratSchema), errors);
  const formationStatus = getBlocCompletion(Object.keys(formationSchema), "formation", errors);
  const maitreStatus = getBlocCompletion(Object.keys(maitreApprentissageSchema), "maitre", errors);
  const apprentiStatus = getBlocCompletion(Object.keys(apprentiSchema), "apprenti", errors);
  const employeurStatus = getBlocCompletion(Object.keys(employeurSchema), "employeur", errors);

  const cerfaTabCompletion =
    (contratStatus.completion +
      formationStatus.completion +
      maitreStatus.completion +
      apprentiStatus.completion +
      employeurStatus.completion) /
    5;

  return {
    contrat: contratStatus,
    formation: formationStatus,
    maitre: maitreStatus,
    apprenti: apprentiStatus,
    employeur: employeurStatus,
    complete: cerfaTabCompletion === 100,
    completion: cerfaTabCompletion,
  };
};

const getContratCompletion = (fieldNames: any, errors: any) => {
  const invalidFields = getInvalidFields(fieldNames, errors);
  const completion = calcCompletion({
    nbRequired: fieldNames.length,
    nbFieldErrors: invalidFields.length,
  });
  return {
    fieldErrors: invalidFields,
    complete: completion === 100,
    completion,
  };
};

const getBlocCompletion = (fieldNames: any, blockName: any, errors: any) => {
  const invalidFields = getInvalidFields(fieldNames, errors);

  const completion = calcCompletion({
    nbRequired: fieldNames.length,
    nbFieldErrors: invalidFields.length,
  });

  return {
    fieldErrors: invalidFields,
    complete: completion === 100,
    completion,
  };
};

const calcCompletion = ({ nbRequired, nbFieldErrors }: any) => Math.round((nbFieldErrors / nbRequired) * 100);

const getInvalidFields = (fieldNames: string[], errors: any) => {
  return fieldNames
    .filter((name) => {
      return get(errors, name);
    })
    .map((name) => get(errors, name));
};
