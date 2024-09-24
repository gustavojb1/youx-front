import {
  Box,
  Flex,
  Avatar,
  HStack,
  Menu,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuButton,
  Text,
} from "@chakra-ui/react";
import Container from "../Container";
import { useAuth } from "../../context/Auth/Auth.Context";
import HorizontalMenu from "../HorizontaMenu";
import { getRoleName } from "../../utils/roles";


export default function Header() {
  const { user, logout } = useAuth();

  return (
    <>
      <Box
        bg="#88C9B9" 
        px={4}
        position="sticky"
        top="0"
        left="0"
        width="100%"
        zIndex={16}
      >
        <Box
          pos="absolute"
          w="19em"
          h="100%"
          left="0"
          bg="linear-gradient(to right, #aae0b1 55%, rgba(136, 201, 185, 0.1))" 
          zIndex=""
        ></Box>
        <Container>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack alignItems={"center"} gridGap="4em">
              <Box zIndex="4">
              </Box>
            </HStack>
            <Flex alignItems={"center"}>
              <Menu>
                <MenuButton>
                  <Avatar
                    size={"sm"}
                    name={user?.username}
                    border="3px solid #fff"
                    bg="#6e988e"
                  />
                </MenuButton>
                <MenuList>
                  <Box paddingX={4}>
                    {user?.username}
                    <Text fontSize="xs">{getRoleName(user?.role_id)}</Text>
                  </Box>
                  <MenuDivider />
                  <MenuItem onClick={logout}>Sair</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <HorizontalMenu />
    </>
  );
}
