
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Spinner,
  Center,
  useToast,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import apiService from "../../../services/api.service";
import TableComponent from "../../../components/Table";
import { useAuth } from "../../../context/Auth/Auth.Context";
import UserFormModal from "../../../components/UserFormModal";
import { User } from "@/types/User";
import { getRoleName, USER_ROLES } from "../../../utils/roles";
import { formatDateTime } from "../../../utils/formatDate";

const GerenciarUsuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const { user, isAuthenticated } = useAuth();

  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      
      if (user?.role_id === USER_ROLES.NURSE || user?.role_id === USER_ROLES.DOCTOR) {
        
        const response = await apiService.get("/users/patients");
        setUsers(response.data);
      } else {
        
        const response = await apiService.get("/users");
        setUsers(response.data);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao buscar usuários.",
        description:
          "Não foi possível carregar os dados dos usuários. Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  
  const deleteUser = async (id: string) => {
    try {
      await apiService.delete(`/users/${id}`);
      toast({
        title: "Usuário deletado.",
        description: "O usuário foi removido com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      await fetchUsers();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao deletar usuário.",
        description:
          "Não foi possível deletar o usuário. Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  
  const handleDeleteConfirmation = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  
  const handleDelete = () => {
    if (selectedUser?.id) {
      deleteUser(selectedUser.id);
    }
    onClose();
  };

  
  const handleAddUser = () => {
    setSelectedUser(null);
    onFormOpen();
  };

  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    onFormOpen();
  };

  
  const handleSaveUserAsync = async (user: User, password?: string) => {
    try {
      if (user.id) {
        const editUser= {
          username: user.username,
          email: user.email,
          roleId: user.role_id,
        }
        
        await apiService.put(`/users/${user.id}`, editUser);
        toast({
          title: "Usuário atualizado.",
          description: "Os dados do usuário foram atualizados com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        
        const newUser = {
          username: user.username,
          email: user.email,
          password: password,
          roleId: user.role_id,
        };
        await apiService.post("/users/signup", newUser);
        toast({
          title: "Usuário adicionado.",
          description: "O novo usuário foi adicionado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar usuário.",
        description: "Não foi possível salvar o usuário. Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setSelectedUser(null);
    }
  };

  const handleSaveUser = (user: User, password?: string) => {
    handleSaveUserAsync(user, password);
  };

  const handleCloseForm = () => {
    setSelectedUser(null);
    onFormClose();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const columns = [
    { header: "Nome de Usuário", accessor: "username" },
    { header: "Papel", accessor: "friendlyRole" },
    { header: "E-mail", accessor: "email" },
    { header: "Data de Criação", accessor: "formattedCreatedAt" }, 
  ];

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return (
      <Center h="100vh">
        <Box>
          <Box mb={4}>
            <Button
              colorScheme="teal"
              onClick={() => (window.location.href = "/login")}
            >
              Faça login para acessar esta página
            </Button>
          </Box>
        </Box>
      </Center>
    );
  }

  return (
    <Center p={4}>
      <Box maxW="1200px" width="100%" p={4} bg="white" boxShadow="md" borderRadius="md">
        <TableComponent
          title="Gerenciar Usuários"
          description="Visualize, edite ou exclua os usuários cadastrados no sistema."
          columns={columns}
          data={users.map(user => ({
            ...user,
            friendlyRole: getRoleName(user.role_id),
            formattedCreatedAt: formatDateTime(user.created_at), 
          }))}
          actions={(row) => {
            const userRow: User = {
              id: row.id,
              username: row.username,
              email: row.email,
              role_id: row.role_id,
              created_at: row.created_at,
            };

            return (
              <>
                <Button
                  colorScheme="blue"
                  size="sm"
                  mr={2}
                  onClick={() => handleEditUser(userRow)}
                >
                  Editar
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteConfirmation(userRow)}
                >
                  Excluir
                </Button>
              </>
            );
          }}
          customButton={(buttonSize, onClick, label) => (
            <Button size={buttonSize} colorScheme="green" onClick={handleAddUser}>
              {label}
            </Button>
          )}
        />

        <UserFormModal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveUser}
          initialData={selectedUser || undefined}
        />

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Deletar Usuário
              </AlertDialogHeader>
              <AlertDialogBody>
                Você tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Deletar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Center>
  );
};

export default GerenciarUsuarios;
