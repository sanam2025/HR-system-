import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Plus } from "lucide-react";
import ContractTableRow from "../Components/Special_Components/ContractTableRow";
import ContractFormModal from "../Components/Special_Components/ContractFormModal";
import ContractRenewalModal from "../Components/Special_Components/ContractRenewalModal";
import type { EmployeeContract } from "../types/contract.types";const INITIAL_CONTRACTS: EmployeeContract[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Ahmed Mansour",
    employeeEmail: "ahmed.mansour@example.com",
    department: "Information Technology",
    position: "Web Developer",
    contractNumber: "CT-2024-001",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    salary: 18000000,
    workingHours: "40 hours/week",
    benefits: "Health insurance, 21 paid leave days",
    status: "active",
    signedDate: "2024-01-01",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Sara Khalil",
    employeeEmail: "sara.khalil@example.com",
    department: "Basic Sciences",
    position: "Professor",
    contractNumber: "CT-2024-002",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    salary: 25000000,
    workingHours: "35 hours/week",
    benefits: "Health insurance, Research allowance",
    status: "active",
    signedDate: "2024-02-01",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Omar Hassan",
    employeeEmail: "omar.hassan@example.com",
    department: "Electrical Engineering",
    position: "Department Head",
    contractNumber: "CT-2023-001",
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    salary: 35000000,
    workingHours: "40 hours/week",
    benefits: "Full benefits, Car allowance",
    status: "expired",
    signedDate: "2023-06-01",
  },
];

const COLUMNS_KEYS = [
  { key: "contractNum", label: "Contract #" },
  { key: "employee", label: "Employee" },
  { key: "department", label: "Department" },
  { key: "position", label: "Position" },
  { key: "period", label: "Period" },
  { key: "salary", label: "Salary" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];interface CreateContractData {
  contractNumber: string;
  startDate: string;
  endDate: string;
  salary: number;
  workingHours: string;
  benefits: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
}

interface RenewalData {
  contractId: string;
  employeeId: string;
  employeeName: string;
  oldEndDate: string;
  newEndDate: string;
  newSalary?: number;
  renewalReason: string;
}export default function Contracts() {
  const { t } = useTranslation();
  const [contracts, setContracts] =
    useState<EmployeeContract[]>(INITIAL_CONTRACTS);
  const [selectedContract, setSelectedContract] =
    useState<EmployeeContract | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);

  const handleView = (contract: EmployeeContract) => {
    alert(
      `Contract Details:\nNumber: ${contract.contractNumber}\nEmployee: ${contract.employeeName}\nPeriod: ${contract.startDate} → ${contract.endDate}\nSalary: ${contract.salary.toLocaleString()} SYP`,
    );
  };

  const handleCreate = (data: CreateContractData) => {
    const newContract: EmployeeContract = {
      id: String(Date.now()),
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      employeeEmail: data.employeeEmail,
      department: data.department,
      position: data.position,
      contractNumber: data.contractNumber,
      startDate: data.startDate,
      endDate: data.endDate,
      salary: data.salary,
      workingHours: data.workingHours,
      benefits: data.benefits,
      status: "active",
      signedDate: new Date().toISOString().split("T")[0],
    };
    setContracts((prev) => [newContract, ...prev]);
    alert(`Contract created for ${data.employeeName}`);
    setIsContractModalOpen(false);
  };

  const handleRenew = (contract: EmployeeContract) => {
    setSelectedContract(contract);
    setIsRenewalModalOpen(true);
  };

  const handleSendRenewal = (data: RenewalData) => {
    if (selectedContract) {
      setContracts((prev) =>
        prev.map((c) =>
          c.id === selectedContract.id
            ? {
                ...c,
                status: "renewed" as const,
                endDate: data.newEndDate,
                salary: data.newSalary || c.salary,
              }
            : c,
        ),
      );
    }
    alert(`Renewal sent to ${data.employeeName}`);
    setIsRenewalModalOpen(false);
  };

  const handleNewContract = () => {
    setIsContractModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ContractFormModal
        isOpen={isContractModalOpen}
        employeeName=""
        employeeId=""
        employeeEmail=""
        department=""
        position=""
        onClose={() => setIsContractModalOpen(false)}
        onSubmit={handleCreate}
      />
      <ContractRenewalModal
        isOpen={isRenewalModalOpen}
        contract={selectedContract}
        onClose={() => setIsRenewalModalOpen(false)}
        onSubmit={handleSendRenewal}
      />

      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{t('employmentContracts') || 'Employment Contracts'}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {t('manageContracts') || 'Manage employee contracts and renewals.'}
          </p>
        </div>
        <button
          onClick={handleNewContract}
          className="flex items-center gap-2 px-4 py-2 bg-green text-white rounded-xl hover:bg-green-dark"
        >
          <Plus className="w-4 h-4" /> {t('newContract') || 'New Contract'}
        </button>
      </div>      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS_KEYS.map((col) => (
                  <th
                    key={col.key}
                    className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {t(col.key) || col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <ContractTableRow
                  key={contract.id}
                  contract={contract}
                  onView={handleView}
                  onRenew={handleRenew}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
