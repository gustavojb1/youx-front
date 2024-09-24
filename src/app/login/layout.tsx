
"use client";
import { ReactNode } from "react";


export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#E8F5F2",

      }}
    >
      {children}
    </div>
  );
}
