import { CerfaControl, CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

interface CreateCopyOrRestoreRuleParams {
  deps: string[];
  mapping: Record<string, string>;
  restoreIf: ({ values }: CerfaForm) => boolean;
  useCache?: boolean;
  fieldNames?: string[];
}

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
