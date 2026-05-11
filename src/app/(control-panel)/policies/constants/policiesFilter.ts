import { AssignmentType } from "../../brokerage/types/brokerageTypes";
import type { PolicyEntity } from "../../brokerage/types/brokerageTypes";

const assignmentFilterOptions: Array<{
    value: "all" | AssignmentType;
    label: string;
}> = [
        { value: "all", label: "Todas" },
        { value: "gym", label: "G&M" },
        { value: "agent", label: "Subagente" },
    ];

const statusFilterOptions: Array<{
    value: "all" | PolicyEntity["status"];
    label: string;
}> = [
        { value: "all", label: "Todos" },
        { value: "new", label: "Nueva" },
        { value: "renewed", label: "Renovada" },
        { value: "cancelled", label: "Anulada" },
        { value: "active", label: "Activa" },
    ];

export { assignmentFilterOptions, statusFilterOptions };