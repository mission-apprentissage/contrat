import { CerfaControl, CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

interface CreateCopyOrRestoreRuleParams {
  deps: string[];
  mapping: Record<string, string>;
  restoreIf: ({ values }: CerfaForm) => boolean;
  useCache?: boolean;
  fieldNames?: string[];
}

type ControlGenerator = (params: CreateCopyOrRestoreRuleParams) => CerfaControl;

export const createCopyOrRestoreRule = ({
  deps,
  restoreIf,
  mapping,
  useCache = true,
}: CreateCopyOrRestoreRuleParams): CerfaControl => {
  return {
    deps,
    process: ({ values, cache, fields }) => {
      const shouldRestore = restoreIf({ values });
      if (shouldRestore) {
        const cascade = Object.entries(mapping).reduce((acc, [, target]) => {
          const valueToRestore = useCache ? cache?.[target].value : undefined;
          return {
            ...acc,
            [target]: {
              value: valueToRestore,
              reset: !valueToRestore,
            },
          };
        }, {});
        return { cascade };
      } else {
        const cascade = Object.entries(mapping).reduce((acc, [from, target]) => {
          return {
            ...acc,
            [target]: {
              value: fields[from].value,
              reset: true,
            },
          };
        }, {});
        return { cache: fields, cascade };
      }
    },
  };
};

export const createResetOrRestoreRule: ControlGenerator = ({ deps, restoreIf, fieldNames, useCache = true }) => {
  return {
    deps,
    process: ({ values, cache, fields }) => {
      const shouldRestore = restoreIf({ values });
      if (shouldRestore) {
        const cascade = fieldNames?.reduce((acc, name) => {
          const valueToRestore = useCache ? cache?.[name].value : undefined;
          return {
            ...acc,
            [name]: {
              value: valueToRestore,
              reset: !valueToRestore,
            },
          };
        }, {});
        return { cascade };
      } else {
        const cascade = fieldNames?.reduce((acc, name) => {
          return {
            ...acc,
            [name]: {
              value: undefined,
              reset: true,
            },
          };
        }, {});
        return { cache: fields, cascade };
      }
    },
  };
};
