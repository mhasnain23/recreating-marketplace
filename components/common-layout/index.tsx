"use client";

import { ReactNode } from "react";
// import ClientSessionProvider from "@/components/client-session-provider";
import { SessionProvider } from "next-auth/react";

const CommonLayout = ({ children }: { children: ReactNode }) => {

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};

export default CommonLayout;
