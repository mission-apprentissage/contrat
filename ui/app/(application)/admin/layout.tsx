"use client";
import { useAuth } from "context/AuthContext";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren } from "react";

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { push } = useRouter();

  if (!user?.is_admin) {
    push("/auth/connexion");
    return null;
  }

  return <>{children}</>;
};

export default AdminLayout;
