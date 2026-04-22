import { AssignmentType } from "../../brokerage/types/brokerageTypes";

const assignmentFilterOptions: Array<{
    value: "all" | AssignmentType;
    label: string;
}> = [
        { value: "all", label: "Todas" },
        { value: "gym", label: "G&M" },
        { value: "agent", label: "Subagente" },
    ];

export { assignmentFilterOptions };