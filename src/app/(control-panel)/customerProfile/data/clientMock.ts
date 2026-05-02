export const MOCK_CUSTOMER = {
  name: "Rodolfo Antonio Ramos Ponce",
  id: "12345",
  type: "Natural",
  status: "Activo",
  email: "rodolfo.ramos@ejemplo.com",
  phone: "+505 8888-8888",
  stats: {
    totalPolicies: 2,
    totalClaims: 2,
    activePolicies: 1,
  },
  documents: ["Cédula_Frontal.pdf", "Formulario_Identificación.pdf"],
  policies: [
    {
      number: "POL-2024-9901",
      docs: ["Carátula_Automóvil.pdf", "Recibo_Prima.pdf"],
    },
    {
      number: "POL-2024-1150",
      docs: ["Endoso_Aumento_Suma.pdf"],
    },
  ],
  claims: [
    {
      id: "SIN-001",
      docs: ["Informe_Ajustador.pdf", "Fotos_Daños.jpg"],
    },
  ],
};