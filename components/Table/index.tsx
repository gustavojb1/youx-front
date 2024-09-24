"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  HStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";

interface TableColumn {
  header: string;
  accessor: string;
}

interface TableProps {
  title: string;
  description: string;
  columns: TableColumn[];
  data: Record<string, any>[];
  actions?: (row: Record<string, any>, buttonSize: string | undefined) => ReactNode;
  customButton?: (buttonSize: string | undefined, onClick: () => void, label: string) => ReactNode;
}

const TableComponent: React.FC<TableProps> = ({
  title,
  description,
  columns,
  data,
  actions,
  customButton,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue({ base: "xs", md: "sm" });

  
  const [tableData, setTableData] = useState(data);

  
  const handleAddRow = () => {
    const newRow = columns.reduce((acc, column) => {
      acc[column.accessor] = ""; 
      return acc;
    }, {} as Record<string, any>);
    setTableData([...tableData, newRow]);
  };

  return (
    <Box
      overflowX="auto"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      borderColor="gray.200"
      boxShadow="md"
    >
      <HStack justifyContent="space-between" mb={4}>
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            {title}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {description}
          </Text>
        </Box>
        {customButton ? customButton(buttonSize, handleAddRow, "Adicionar") : null}
      </HStack>
      <TableContainer>
        <Table variant="simple" size={isMobile ? "sm" : "md"}>
          <Thead bg="gray.50">
            <Tr>
              {columns.map((column) => (
                <Th
                  key={column.accessor}
                  textAlign="left"
                  borderColor="gray.200"
                  fontSize={isMobile ? "xs" : "sm"}
                  py={isMobile ? 2 : 4}
                >
                  {column.header}
                </Th>
              ))}
              {actions && (
                <Th
                  textAlign="center"
                  borderColor="gray.200"
                  fontSize={isMobile ? "xs" : "sm"}
                  py={isMobile ? 2 : 4}
                >
                  Ações
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length + (actions ? 1 : 0)} textAlign="center" py={4}>
                  Nenhum registro encontrado.
                </Td>
              </Tr>
            ) : (
              tableData.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {columns.map((column) => (
                    <Td
                      key={column.accessor}
                      borderColor="gray.200"
                      fontSize={isMobile ? "xs" : "sm"}
                      py={isMobile ? 2 : 4}
                      whiteSpace={isMobile ? "normal" : "nowrap"}
                    >
                      {row[column.accessor]}
                    </Td>
                  ))}
                  {actions && (
                    <Td borderColor="gray.200" textAlign="center" whiteSpace="nowrap">
                      <HStack justifyContent="center" spacing={2}>
                        {actions(row, buttonSize)}
                      </HStack>
                    </Td>
                  )}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableComponent;
