"use client";

import { publicConfig } from "config.public";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { FC, useRef } from "react";

interface Props {
  children: React.ReactNode;
}

const RootMarketingTemplate: FC<Props> = ({ children }) => {
  const searchParams = useSearchParams();
  const tracking = useRef(searchParams?.get("notracking") !== "true");

  return (
    <PlausibleProvider trackLocalhost={false} enabled={tracking.current} domain={publicConfig.host}>
      {children}
    </PlausibleProvider>
  );
};

export default RootMarketingTemplate;
