"use client";
import { useState } from "react";
import { Button, Input, Box, useToast, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/Auth/Auth.Context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    console.log("Fazendo login..."); 

    try {
      await login(email, password);
      toast({
        title: "Login bem-sucedido.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/");
    } catch (error) {
      console.log("Erro capturado:", error);
      toast({
        title: "Erro ao fazer login.",
        description:
          error instanceof Error ? error.message : "Erro desconhecido.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="white" p="8" borderRadius="10" shadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px">
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mb={4}
      />
      <Input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb={4}
      />
      <Flex justifyContent="flex-end">
        <Button isLoading={isLoading} onClick={handleLogin} colorScheme="blue">
          Entrar
        </Button>
      </Flex>
    </Box>
  );
}

