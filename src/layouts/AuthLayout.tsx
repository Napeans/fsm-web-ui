import type { ReactNode } from "react";
import "./AuthLayout.css";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
};

export default AuthLayout;