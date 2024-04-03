import { publicConfig } from "config.public";
import React, { FC } from "react";

const Statistics: FC = () => {
  if (!publicConfig.plausible) {
    return null;
  }

  return (
    <iframe
      plausible-embed
      style={{ height: "250vh", width: "100%" }}
      src={`${publicConfig.plausible}&theme=light&background=transparent`}
      loading="lazy"
    />
  );
};

export default Statistics;
