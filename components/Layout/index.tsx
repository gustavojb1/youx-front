"use client";
import { Box, Flex } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import Header from "../Header";
import { usePathname } from "next/navigation";

const LayoutComponent: FunctionComponent<{ children: ReactNode }> = ({ children }) => {

  const pathname = usePathname();

  if (pathname === "/login") {
    return (
      <div lang="pt-BR">
          {children}
      </div>
    );
  }

  return (
    <Flex flexDirection="column" bg="#E8F5F2  " height="100vh" overflow="hidden">
      <Header />
      <Flex overflow="hidden" height="100%">
        <Box flex="1" overflowX="hidden" overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default LayoutComponent;
