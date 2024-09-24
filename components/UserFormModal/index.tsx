
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Select,
} from "@chakra-ui/react";
import { USER_ROLES, getRoleName } from "../../utils/roles"; 
import { User } from "@/types/User";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User, password?: string) => void; 
  initialData?: User;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [user, setUser] = useState<User>({
    id: "",
    username: "",
    email: "",
    role_id: "",
    created_at: "",
  });

  const [password, setPassword] = useState<string>(""); 

  useEffect(() => {
    if (initialData) {
      setUser(initialData);
    } else {
      setUser({
        id: "",
        username: "",
        email: "",
        role_id: "",
        created_at: "",
      });
      setPassword("");
    }
  }, [initialData]);

  const handleChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [field]: e.target.value });
  };

  const handleSave = () => {
    onSave(user, password || undefined);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? "Editar Usuário" : "Adicionar Novo Usuário"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Nome de Usuário</FormLabel>
              <Input
                value={user.username}
                onChange={handleChange("username")}
                placeholder="Digite o nome do usuário"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={user.email}
                onChange={handleChange("email")}
                placeholder="Digite o email"
              />
            </FormControl>
            {!initialData && ( 
              <FormControl>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                />
              </FormControl>
            )}
            <FormControl>
              <FormLabel>Papel</FormLabel>
              <Select
                value={user.role_id}
                onChange={handleChange("role_id")}
                placeholder="Selecione o papel"
              >
                {Object.values(USER_ROLES).map((value) => (
                  <option key={value} value={value}>
                    {getRoleName(value)} 
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="teal" onClick={handleSave} ml={3}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserFormModal;
