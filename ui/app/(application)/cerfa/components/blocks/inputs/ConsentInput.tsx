import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const mapState = (state: "error" | "info" | "default" | "success" | undefined) => {
  if (state === "info") return "default";
  return state;
};

const ConsentInput: FC<InputFieldProps> = ({ fieldSchema, state, stateRelatedMessage, inputProps }) => {
  return (
    <Checkbox
      options={[
        {
          label: fieldSchema?.label ?? "",
          nativeInputProps: inputProps,
        },
      ]}
      state={mapState(state)} // Use the mapped state
      stateRelatedMessage={stateRelatedMessage}
      disabled={inputProps.disabled}
    />
  );
};

export default ConsentInput;
