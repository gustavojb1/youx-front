
"use client";

import {
  Box,
  HStack,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Auth/Auth.Context";
import { USER_ROLES } from "../../utils/roles";
import { HamburgerIcon } from "@chakra-ui/icons";

const HorizontalMenu = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose(); 
  };

  const renderMenuItems = () => {
    const menuItems = [];

    if (user?.role_id === USER_ROLES.PATIENT) {
      menuItems.push(
        <Button
          key="minhas-consultas"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/minhas-consultas")}
        >
          Minhas Consultas
        </Button>
      );
    }

    if (user?.role_id === USER_ROLES.NURSE) {
      menuItems.push(
        <Button
          key="aprovar-consultas"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/aprovar-consultas")}
        >
          Aprovar Consultas
        </Button>,
        <Button
          key="gerenciar-usuarios"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/gerenciar-usuarios")}
        >
          Pacientes
        </Button>,
        <Button
          key="agenda-medica"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/agenda-medica")}
        >
          Agenda Médica
        </Button>,
        <Button
          key="historico-paciente"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/historico-paciente")}
        >
          Histórico de Pacientes
        </Button>
      );
    }

    if (user?.role_id === USER_ROLES.DOCTOR) {
      menuItems.push(
        <Button
          key="minhas-consultas-doctor"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/minhas-consultas")}
        >
          Minhas Consultas
        </Button>,
        <Button
          key="gerenciar-usuarios-doctor"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/gerenciar-usuarios")}
        >
          Pacientes
        </Button>,
        <Button
          key="finalizar-consultas"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/finalizar-consultas")}
        >
          Finalizar Consultas
        </Button>,
        <Button
          key="historico-paciente-doctor"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/historico-paciente")}
        >
          Histórico de Pacientes
        </Button>
      );
    }

    if (user?.role_id === USER_ROLES.ADMIN) {
      menuItems.push(
        <Button
          key="consultas"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/minhas-consultas")}
        >
          Consultas
        </Button>,
        <Button
          key="gerenciar-usuarios-admin"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/gerenciar-usuarios")}
        >
          Gerenciar Usuários
        </Button>,
        <Button
          key="relatorios"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/relatorios")}
        >
          Relatórios
        </Button>,
        <Button
          key="historico-paciente-admin"
          variant="ghost"
          colorScheme="teal"
          onClick={() => handleNavigation("/historico-paciente")}
        >
          Histórico de Pacientes
        </Button>
      );
    }

    return menuItems;
  };

  return (
    <Box bg="#e0f2e9" py={2} boxShadow="md">
      <HStack
        justifyContent="center" 
        spacing={6}
        display={{ base: "none", md: "flex" }}
      >
        {renderMenuItems()}
      </HStack>
      <IconButton
        aria-label="Open Menu"
        icon={<HamburgerIcon />}
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        colorScheme="teal"
        m={2}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navegação</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              {renderMenuItems()}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default HorizontalMenu;
