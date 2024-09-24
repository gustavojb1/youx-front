import React from "react";
import { Box } from "@chakra-ui/react";

interface ContainerProps {
  children: React.ReactNode;
  size?: string;
}

const Container = ({ children, size }: ContainerProps) => {
  return (
    <Box>
      <Box
        maxWidth={size ? size : ["95%", "90%", "95%", "90%", "98.5%"]}
        margin="0 auto"
      >
        {children}
      </Box>
    </Box>
  );
};

export default Container;
