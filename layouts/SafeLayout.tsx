import React from "react";

export interface SafeLayoutProps {
  children: React.ReactNode;
}

export default function SafeLayout({ children }: SafeLayoutProps) {
  return <div className="safe-layout">{children}</div>;
}
