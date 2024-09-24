"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Spinner,
  Center,
  useToast,
  Button,
  HStack,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import apiService from "../../../services/api.service";
import TableComponent from "../../../components/Table";
import { useAuth } from "../../../context/Auth/Auth.Context";
import { USER_ROLES } from "../../../utils/roles"; 
import ConsultationFormModal from "../../../components/ConsultationFormModal";

interface Consulta {
  id: string;
  patientId: string;
  nomeDoPaciente: string;
  doctorId: string;
  nomeDoDoutor: string;
  nurseId: string;
  nomeDaEnfermeira: string;
  appointmentDate: string;
  reason: string;
  locationId: string;
  status: string;
}

interface ConsultationData {
  patientId: string;
  appointmentDate: string;
  reason: string;
  locationId: string;
  nurseId: string;
}

const MinhasConsultas = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    isOpen: isStatusModalOpen,
    onOpen: onStatusModalOpen,
    onClose: onStatusModalClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();

  const fetchConsultas = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/consultation/${user?.id}`);
      setConsultas(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao buscar consultas.",
        description:
          "Não foi possível carregar as consultas. Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteConsulta = async (id: string) => {
    try {
      await apiService.delete(`/consultation/${id}`);
      toast({
        title: "Consulta deletada.",
        description: "A consulta foi removida com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      await fetchConsultas();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao deletar consulta.",
        description:
          "Não foi possível deletar a consulta. Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirmation = (consulta: Consulta) => {
    setSelectedConsulta(consulta);
    onAlertOpen();
  };

  const handleDelete = () => {
    if (selectedConsulta?.id) {
      deleteConsulta(selectedConsulta.id);
    }
    onAlertClose();
  };

  const handleSaveConsulta = async (data: ConsultationData) => {
    try {
      if (selectedConsulta) {
        
        await apiService.put(`/consultation/${selectedConsulta.id}`, data);
        toast({
          title: "Consulta atualizada.",
          description: "A consulta foi atualizada com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        
        await apiService.post("/consultation", { ...data, doctorId: user?.id });
        toast({
          title: "Consulta criada.",
          description: "A consulta foi criada com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      setSelectedConsulta(null);
      fetchConsultas();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar consulta.",
        description:
          "Não foi possível salvar a consulta. Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditConsulta = (consulta: Consulta) => {
    setSelectedConsulta(consulta);
    onFormOpen();
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleOpenStatusModal = (consulta: Consulta) => {
    setSelectedConsulta(consulta);
    setSelectedStatus(consulta.status);
    onStatusModalOpen();
  };

  const handleUpdateStatus = async () => {
    if (!selectedConsulta) return;

    try {
      await apiService.put(`/consultation/${selectedConsulta.id}`, {
        status: selectedStatus,
      });
      toast({
        title: "Status atualizado.",
        description: "O status da consulta foi atualizado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onStatusModalClose();
      fetchConsultas();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao atualizar status.",
        description:
          "Não foi possível atualizar o status da consulta. Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchConsultas();
    }
  }, [isAuthenticated, user?.id]);

  const columns = [
    { header: "Paciente", accessor: "nomeDoPaciente" },
    { header: "Doutor", accessor: "nomeDoDoutor" },
    { header: "Enfermeira", accessor: "nomeDaEnfermeira" },
    { header: "Data", accessor: "appointmentDate" },
    { header: "Motivo", accessor: "reason" },
    { header: "Localização", accessor: "locationId" },
    { header: "Status", accessor: "status" },
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
      <Box
        maxW="1200px"
        width="100%"
        p={4}
        bg="white"
        boxShadow="md"
        borderRadius="md"
      >
        <HStack justifyContent="space-between" mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            Minhas Consultas
          </Text>
          <Button
            colorScheme="green"
            onClick={() => {
              setSelectedConsulta(null);
              onFormOpen();
            }}
          >
            Agendar Consulta
          </Button>
        </HStack>
        <TableComponent
          title="Consultas"
          description="Visualize suas consultas agendadas."
          columns={columns}
          data={consultas}
          actions={(row) => {
            
            const consultaRow: Consulta = {
              id: row.id,
              patientId: row.patientId,
              nomeDoPaciente: row.nomeDoPaciente,
              doctorId: row.doctorId,
              nomeDoDoutor: row.nomeDoDoutor,
              nurseId: row.nurseId,
              nomeDaEnfermeira: row.nomeDaEnfermeira,
              appointmentDate: row.appointmentDate,
              reason: row.reason,
              locationId: row.locationId,
              status: row.status,
            };

            return (
              <>
                {(user?.role_id === USER_ROLES.DOCTOR ||
                  user?.role_id === USER_ROLES.ADMIN) && (
                  <Button
                    colorScheme="orange"
                    size="sm"
                    onClick={() => handleOpenStatusModal(consultaRow)}
                  >
                    Status
                  </Button>
                )}
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => handleEditConsulta(consultaRow)}
                >
                  Editar
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteConfirmation(consultaRow)}
                >
                  Excluir
                </Button>
              </>
            );
          }}
        />

        <ConsultationFormModal
          isOpen={isFormOpen}
          onClose={onFormClose}
          onSave={handleSaveConsulta}
          initialData={selectedConsulta || undefined}
        />

        <Modal isOpen={isStatusModalOpen} onClose={onStatusModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Alterar Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Agendado">Agendado</option>
                  <option value="Finalizado">Finalizado</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleUpdateStatus}>
                Salvar
              </Button>
              <Button onClick={onStatusModalClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={onAlertClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Deletar Consulta
              </AlertDialogHeader>
              <AlertDialogBody>
                Você tem certeza que deseja excluir esta consulta? Essa ação não
                pode ser desfeita.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertClose}>
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

export default MinhasConsultas;
