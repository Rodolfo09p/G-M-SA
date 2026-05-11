export type CustomerDocument = {
  customerId: string;
  label: string;
  expirationDate: string;
};

const customerDocumentsMockData: CustomerDocument[] = [
  {
    customerId: "086-210760-0001M",
    label: "Cédula de Identidad",
    expirationDate: "2025-12-15",
  },
  {
    customerId: "086-210760-0001M",
    label: "Circulación del Vehículo",
    expirationDate: "2026-02-01",
  },
  {
    customerId: "001-290796-0005N",
    label: "Cédula de Identidad",
    expirationDate: "2029-08-10",
  },
  {
    customerId: "J0310000183250",
    label: "Cédula RUC",
    expirationDate: "2024-11-30",
  },
];

const toDateAtMidnight = (value: string) => {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getExpiredCustomerDocuments = (
  customerId: string,
  referenceDate = new Date(),
): CustomerDocument[] => {
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );

  return customerDocumentsMockData.filter((document) => {
    if (document.customerId !== customerId) {
      return false;
    }

    return toDateAtMidnight(document.expirationDate) < today;
  });
};
