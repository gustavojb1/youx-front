
"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect, useRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBounds, LatLngExpression, LatLngTuple } from "leaflet";
import apiService from "../../services/api.service";
import { useAuth } from "../../context/Auth/Auth.Context";

const defaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface ConsultationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ConsultationData) => void;
  initialData?: ConsultationData;
}

interface ConsultationData {
  patientId: string;
  appointmentDate: string;
  reason: string;
  locationId: string;
  nurseId: string;
}

interface Patient {
  id: string;
  nome: string;
  username: string;
}

interface Nurse {
  id: string;
  nome: string;
  username: string;
}

interface Location {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
}

const ConsultationFormModal: React.FC<ConsultationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { user, isPatient } = useAuth();
  const [formData, setFormData] = useState<ConsultationData>(
    initialData || {
      patientId: user?.id || "",
      appointmentDate: "",
      reason: "",
      locationId: "",
      nurseId: "",
    }
  );
  const [patients, setPatients] = useState<Patient[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [initialCenter, setInitialCenter] = useState<LatLngExpression>([0, 0]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const bounds = new LatLngBounds(
    locations.map(
      (location) => [location.latitude, location.longitude] as [number, number]
    )
  );

  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedLocationId(initialData.locationId);
    } else {
      setFormData({
        patientId: user?.id || "",
        appointmentDate: "",
        reason: "",
        locationId: "",
        nurseId: "",
      });
    }
  }, [initialData, user]);

  useEffect(() => {
    if (!isPatient || initialData) {
      fetchPatients();
    }
    fetchNurses();
    fetchLocations();
  }, [isPatient, initialData]);

  useEffect(() => {
    if (locations.length > 0) {
      fitMapToBounds();
    }
  }, [locations]);

  const fetchPatients = async () => {
    try {
      const response = await apiService.get("/users/patients");
      setPatients(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao buscar pacientes.",
        description: "Não foi possível carregar a lista de pacientes.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchNurses = async () => {
    try {
      const response = await apiService.get("/users/nurses");
      setNurses(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao buscar enfermeiras.",
        description: "Não foi possível carregar a lista de enfermeiras.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await apiService.get("/location");
      setLocations(response.data);
    } catch (error) {
      console.error(error);

      toast({
        title: "Erro ao buscar localizações.",
        description: "Não foi possível carregar a lista de localizações.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "locationId") {
      setSelectedLocationId(value);
      const selected = locations.find((location) => location.id === value);
      if (selected) {
        centerMapToLocation(selected);
      }
    }
  };

  const handleSave = () => {
    if (!formData.patientId || !formData.appointmentDate || !formData.reason || !formData.locationId) {
      toast({
        title: "Campos obrigatórios faltando.",
        description: "Preencha todos os campos obrigatórios.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSave(formData);
    onClose();
  };

  const fitMapToBounds = () => {
    setInitialCenter(
      selectedLocationId
      ? locations.find((loc) => loc.id === selectedLocationId)
        ? [
            locations.find((loc) => loc.id === selectedLocationId)!.latitude,
            locations.find((loc) => loc.id === selectedLocationId)!.longitude,
          ]
        : bounds.getCenter()
      : bounds.getCenter()

    ) 

    
  };

  const centerMapToLocation = (location: Location) => {
    if (mapRef.current) {
      mapRef.current.setView([location.latitude, location.longitude], 14);
    }
  };

  const handleMarkerClick = (location: Location) => {
    setFormData({ ...formData, locationId: location.id });
    setSelectedLocationId(location.id);
    centerMapToLocation(location);
  };

  useImperativeHandle(mapRef, () => mapRef.current as L.Map, [mapRef.current]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? "Editar Consulta" : "Criar Nova Consulta"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isPatient || initialData ? (
            <FormControl mb={4}>
              <FormLabel>Paciente</FormLabel>
              <Select
                placeholder="Selecione o paciente"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.username}
                  </option>
                ))}
              </Select>
            </FormControl>
          ) : (
            <FormControl mb={4}>
              <FormLabel>Paciente</FormLabel>
              <Input value={user?.username || ""} isReadOnly disabled />
            </FormControl>
          )}
          <FormControl mb={4}>
            <FormLabel>Data da Consulta</FormLabel>
            <Input
              type="datetime-local"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Motivo</FormLabel>
            <Input name="reason" value={formData.reason} onChange={handleChange} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Enfermeira</FormLabel>
            <Select
              placeholder="Selecione a enfermeira"
              name="nurseId"
              value={formData.nurseId}
              onChange={handleChange}
            >
              {nurses.map((nurse) => (
                <option key={nurse.id} value={nurse.id}>
                  {nurse.username}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Localização</FormLabel>
            <Select
              placeholder="Selecione a localização"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.address}
                </option>
              ))}
            </Select>
          </FormControl>
          {locations.length > 0 && (
            <MapContainer
              center={initialCenter}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
              ref={(map) => {
                if (map) mapRef.current = map;
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.latitude, location.longitude] as LatLngTuple}
                  icon={selectedLocationId === location.id ? selectedIcon : defaultIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(location),
                  }}
                />
              ))}
            </MapContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConsultationFormModal;
