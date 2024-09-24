"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Spinner,
  useToast,
  Textarea,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import apiService from "../../../services/api.service";
import { useAuth } from "../../../context/Auth/Auth.Context";
import { formatDateTime } from "../../../utils/formatDate";

interface Consulta {
  id: string;
  patientId: string;
  nomeDoPaciente: string;
  status: string;
  notes: string;
  appointmentDate: string;
}

const FinalizarConsultas = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role_id !== "role_medico") {
      router.push("/login");
    } else {
      fetchConsultas();
    }
  }, [isAuthenticated, user, router]);

  
  const fetchConsultas = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/consultation`);
      setConsultas(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao buscar consultas.",
        description: "Não foi possível carregar as consultas.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  
  const handleFinalizarConsulta = async () => {
    if (!selectedConsulta) return;

    try {
      
      await apiService.put(`/consultation/${selectedConsulta.id}`, {
        status: "Finalizado",
      });

      
      if (notes.trim()) {
        await apiService.post(`/patient-record/${selectedConsulta.patientId}/records`, {
          notes,
        });
        toast({
          title: "Nota adicionada.",
          description: "A nota foi salva com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Consulta finalizada.",
          description: "A consulta foi finalizada sem adicionar notas.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      setSelectedConsulta(null);
      setNotes("");
      fetchConsultas();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao finalizar consulta.",
        description: "Não foi possível finalizar a consulta.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Center p={4}>
      <Box maxW="800px" width="100%" p={4} bg="white" boxShadow="md" borderRadius="md">
        <FormControl mb={4}>
          <FormLabel>Selecione a Consulta</FormLabel>
          <Select
            placeholder="Selecione uma consulta para finalizar"
            onChange={(e) => {
              const consulta = consultas.find((c) => c.id === e.target.value);
              setSelectedConsulta(consulta || null);
            }}
          >
            {consultas.map((consulta) => (
              <option key={consulta.id} value={consulta.id}>
                {`${consulta.nomeDoPaciente} - ${consulta.status} - ${formatDateTime(consulta.appointmentDate)}`}
              </option>
            ))}
          </Select>
        </FormControl>
        {selectedConsulta && (
          <>
            <FormControl mb={4}>
              <FormLabel>Notas Médicas</FormLabel>
              <Textarea
                placeholder="Adicione notas médicas (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" onClick={handleFinalizarConsulta}>
              Finalizar Consulta
            </Button>
          </>
        )}
      </Box>
    </Center>
  );
};

export default FinalizarConsultas;
