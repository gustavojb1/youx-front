
"use client";
import { ReactNode } from "react";
import { AuthProvider } from "../../context/Auth/Auth.Context";
import { ChakraProvider } from "@chakra-ui/react";
import LayoutComponent from "../../components/Layout";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ChakraProvider>
            <LayoutComponent>{children}</LayoutComponent>
          </ChakraProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
