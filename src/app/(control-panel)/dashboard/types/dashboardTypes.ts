export type DashboardMetricCardItem = {
  title: string;
  value: string;
  description: string;
  icon: string;
  accentColor: string;
};

export type RenewalPriorityLevel = "critical" | "warning" | "attention";

export type RenewalPriorityItem = {
  id: number;
  clientName: string;
  daysToDue: number;
  level: RenewalPriorityLevel;
};

export type CollectionsBreakdownItem = {
  label: string;
  percent: number;
  color: string;
};

export type MonthlyCollectionsBarItem = {
  month: string;
  collected: number;
  arrears: number;
};
