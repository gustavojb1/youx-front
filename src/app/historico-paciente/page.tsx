"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Spinner,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { useRouter, useParams } from "next/navigation";
import apiService from "../../../services/api.service";
import { useAuth } from "../../../context/Auth/Auth.Context";
import TableComponent from "../../../components/Table";

interface PatientRecord {
  id: string;
  patientName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  nomedoMedico: string;
}

const HistoricoPaciente = () => {
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [newNotes, setNewNotes] = useState<string>("");
  const toast = useToast();
  const router = useRouter();
  const { patientId } = useParams(); 
  const { user, isAuthenticated } = useAuth();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchPatientRecords();
    }
  }, [isAuthenticated, user, patientId, router]);

  
  const fetchPatientRecords = async () => {
    setLoading(true);
    try {
      let url = "";

      
      switch (user?.role_id) {
        case "role_paciente":
          url = `/patient-record/${user.id}/records`;
          break;
        case "role_medico":
          url = `/patient-record/records/doctor/${user.id}`;
          break;
        case "role_enfermeiro":
          url = `/patient-record/records/nurse/${user.id}`;
          break;
        case "role_admin":
          url = `/patient-record/records`;
          break;
        default:
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para visualizar registros.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
      }

      const response = await apiService.get(url);
      setRecords(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao buscar registros.",
        description: "Não foi possível carregar o histórico.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  
  const handleEditRecord = (record: PatientRecord) => {
    setSelectedRecord(record);
    setNewNotes(record.notes);
    onEditOpen();
  };

  
  const handleSaveEdit = async () => {
    if (!selectedRecord) return;

    try {
      await apiService.put(`/patient-record/records/${selectedRecord.id}`, {
        notes: newNotes,
      });
      toast({
        title: "Nota atualizada.",
        description: "A nota foi atualizada com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchPatientRecords();
      onEditClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao atualizar nota.",
        description: "Não foi possível atualizar a nota.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  
  const handleDeleteRecord = (record: PatientRecord) => {
    setSelectedRecord(record);
    onDeleteOpen();
  };

  
  const handleConfirmDelete = async () => {
    if (!selectedRecord) return;

    try {
      await apiService.delete(`/patient-record/records/${selectedRecord.id}`);
      toast({
        title: "Registro excluído.",
        description: "O registro foi removido com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchPatientRecords();
      onDeleteClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao excluir registro.",
        description: "Não foi possível excluir o registro.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const columns = [
    { header: "Data", accessor: "createdAt" },
    { header: "Médico", accessor: "nomedoMedico" },
    { header: "Notas", accessor: "notes" },
  ];

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Center p={4}>
      <Box maxW="1000px" width="100%" p={4} bg="white" boxShadow="md" borderRadius="md">
        <TableComponent
          title="Histórico de Registros Médicos"
          description="Visualize e gerencie as notas médicas."
          columns={columns}
          data={records.map((record) => ({
            ...record,
            createdAt: new Date(record.createdAt).toLocaleString(),
          }))}
          actions={(row) => {
            const record: PatientRecord = {
              id: row.id,
              patientName: row.patientName,
              nomedoMedico: row.nomedoMedico,
              notes: row.notes,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
            };

            return (
              <HStack>
                <Button colorScheme="blue" size="sm" onClick={() => handleEditRecord(record)}>
                  Editar
                </Button>
                <Button colorScheme="red" size="sm" onClick={() => handleDeleteRecord(record)}>
                  Excluir
                </Button>
              </HStack>
            );
          }}
        />

        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Nota</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                placeholder="Edite a nota médica"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>
                Salvar
              </Button>
              <Button onClick={onEditClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Excluir Registro</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Você tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
                Excluir
              </Button>
              <Button onClick={onDeleteClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );
};

export default HistoricoPaciente;
