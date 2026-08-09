// src/core/modules/HR/pages/Contracts.tsx
// (بقية الاستيرادات كما هي)
import React, { useState } from "react";
// تم حذف استيراد Plus لأننا لن نستخدمه بعد الحذف
import ContractTableRow from "../Components/Special_Components/ContractTableRow";
import ContractFormModal from "../Components/Special_Components/ContractFormModal";
import ContractRenewalModal from "../Components/Special_Components/ContractRenewalModal";
import type { EmployeeContract } from "../types/contract.types";

const INITIAL_CONTRACTS: EmployeeContract[] = [
  // ... (بياناتك كما هي) ...
];

const COLUMNS: string[] = [
  "Contract #",
  "Employee",
  "Department",
  "Position",
  "Period",
  "Salary",
  "Status",
  "Actions",
];

// ============= Types =============
interface CreateContractData {
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
}

export default function Contracts() {
  const [contracts, setContracts] =
    useState<EmployeeContract[]>(INITIAL_CONTRACTS);
  const [selectedContract, setSelectedContract] =
    useState<EmployeeContract | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);

  const handleView = (contract: EmployeeContract) => {
    alert(
      `📄 Contract Details:\nNumber: ${contract.contractNumber}\nEmployee: ${contract.employeeName}\nPeriod: ${contract.startDate} → ${contract.endDate}\nSalary: ${contract.salary.toLocaleString()} SYP`
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
    alert(`✅ Contract created for ${data.employeeName}`);
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
            : c
        )
      );
    }
    alert(`📧 Renewal sent to ${data.employeeName}`);
    setIsRenewalModalOpen(false);
  };

  // ✅ تم حذف handleNewContract

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
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

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Employment Contracts</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage employee contracts and renewals.
        </p>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((c) => (
                  <th
                    key={c}
                    className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {c}
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