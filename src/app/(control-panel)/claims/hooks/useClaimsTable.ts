import { useMemo, useState } from "react";
import { AssignmentType } from "../../brokerage/types/brokerageTypes";
import { mapClaimsToRows } from "../helpers/mapClaimsToRows";
import { ClaimStatus, ClaimTableRow } from "../types/types";

type AssignmentFilterValue = "all" | AssignmentType;
type StatusFilterValue = "all" | ClaimStatus;

const useClaimsTable = (refreshKey: number) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] =
    useState<AssignmentFilterValue>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [selectedClaim, setSelectedClaim] = useState<ClaimTableRow | null>(null);

  const rows = useMemo(() => mapClaimsToRows(), [refreshKey]);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        row.claimNumber.toLowerCase().includes(normalizedSearchTerm) ||
        row.policyNumber.toLowerCase().includes(normalizedSearchTerm) ||
        row.customerName.toLowerCase().includes(normalizedSearchTerm) ||
        row.customerId.toLowerCase().includes(normalizedSearchTerm);

      const matchesAssignment =
        assignmentFilter === "all" || row.assignmentType === assignmentFilter;

      const matchesStatus = statusFilter === "all" || row.statusCode === statusFilter;

      return matchesSearch && matchesAssignment && matchesStatus;
    });
  }, [rows, normalizedSearchTerm, assignmentFilter, statusFilter]);

  return {
    searchTerm,
    assignmentFilter,
    statusFilter,
    selectedClaim,
    filteredRows,
    setSearchTerm,
    setAssignmentFilter,
    setStatusFilter,
    setSelectedClaim,
  };
};

export { useClaimsTable };