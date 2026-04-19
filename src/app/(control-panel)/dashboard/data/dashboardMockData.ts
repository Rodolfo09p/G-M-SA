import {
  CollectionsBreakdownItem,
  DashboardMetricCardItem,
  MonthlyCollectionsBarItem,
  RenewalPriorityItem,
} from "../types/dashboardTypes";

export const dashboardMetricCards: DashboardMetricCardItem[] = [
  {
    title: "Poliza por vencer (30 días)",
    value: "42",
    description: "Asegura renovaciones criticas",
    icon: "lucide:calendar-days",
    accentColor: "#EF5350",
  },
  {
    title: "Morosidad Actual",
    value: "$12,480",
    description: "Cartera en riesgo",
    icon: "lucide:wallet",
    accentColor: "#F59E0B",
  },
  {
    title: "Expedientes incompletos",
    value: "18",
    description: "Checklist de documentos",
    icon: "lucide:clipboard-check",
    accentColor: "#42A5F5",
  },
  {
    title: "Ventas mes",
    value: "$28,750",
    description: "Nuevas primas",
    icon: "lucide:trending-up",
    accentColor: "#66BB6A",
  },
];

export const collectionsBreakdownData: CollectionsBreakdownItem[] = [
  {
    label: "Cobrado",
    percent: 70,
    color: "#66BB6A",
  },
  {
    label: "Mora",
    percent: 30,
    color: "#F59E0B",
  },
];

export const monthlyCollectionsBarData: MonthlyCollectionsBarItem[] = [
  { month: "Ene", collected: 64, arrears: 36 },
  { month: "Feb", collected: 67, arrears: 33 },
  { month: "Mar", collected: 70, arrears: 30 },
  { month: "Abr", collected: 72, arrears: 28 },
  { month: "May", collected: 69, arrears: 31 },
];

export const renewalPriorityData: RenewalPriorityItem[] = [
  { id: 1, clientName: "Transportes del Sur", daysToDue: 2, level: "critical" },
  { id: 2, clientName: "Clinica Santa Elena", daysToDue: 3, level: "critical" },
  { id: 3, clientName: "Agroexport Litoral", daysToDue: 6, level: "warning" },
  { id: 4, clientName: "TecnoRed Solutions", daysToDue: 7, level: "warning" },
  { id: 5, clientName: "Industrias Nova", daysToDue: 10, level: "attention" },
];
