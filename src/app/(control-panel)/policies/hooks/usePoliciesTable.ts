import { useMemo, useState } from "react";
import { mapPoliciesToRows } from "../helpers/mapPoliciesToRows";
import { PolicyTableRow } from "../types/types";
import { AssignmentType } from "../../brokerage/types/brokerageTypes";
import { customersMockData, policiesMockData, policyFinancesMockData } from "../../brokerage/data/brokerageMockData";

export const usePoliciesTable = () => {

    const policyRows = mapPoliciesToRows(
        policiesMockData,
        customersMockData,
        policyFinancesMockData
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [assignmentFilter, setAssignmentFilter] = useState<
        "all" | AssignmentType
    >("all");
    const [selectedPolicy, setSelectedPolicy] = useState<PolicyTableRow | null>(
        null,
    );

    const filteredRows = useMemo(() => {
        const normalized = searchTerm.trim().toLowerCase();

        return policyRows.filter((row) => {
            const matchesSearch =
                !normalized ||
                row.policyNumber.toLowerCase().includes(normalized) ||
                row.customerName.toLowerCase().includes(normalized) ||
                row.branch.toLowerCase().includes(normalized);

            const matchesAssignment =
                assignmentFilter === "all" || row.assignmentType === assignmentFilter;

            return matchesSearch && matchesAssignment;
        });
    }, [policyRows, searchTerm, assignmentFilter]);

    return { searchTerm, setSearchTerm, assignmentFilter, setAssignmentFilter, selectedPolicy, setSelectedPolicy, filteredRows };
}