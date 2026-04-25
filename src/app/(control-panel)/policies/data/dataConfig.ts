export type Ramo = "SOA" | "AUTOMOVIL";
export type PersonaType = "NATURAL" | "JURIDICA";

type DocumentItem = {
  key: string;
  label: string;
  required: boolean;
  type: "CLIENT" | "RISK" | "POLICY";
  expirable?: boolean;
  hasExpirationDate?: boolean;
  order: number;
};

type ChecklistConfig = {
  [ramo in Ramo]: {
    [persona in PersonaType]: DocumentItem[];
  };
};

export const checklistConfig: ChecklistConfig = {
  SOA: {
    NATURAL: [
      // CLIENTE
      {
        key: "cedula",
        label: "Cédula de identidad",
        required: true,
        type: "CLIENT",
        expirable: true,
        hasExpirationDate: true,
        order: 1,
      },
      {
        key: "telefono",
        label: "N° Telefónico",
        required: true,
        type: "CLIENT",
        order: 2,
      },
      {
        key: "direccion",
        label: "Dirección de domicilio",
        required: true,
        type: "CLIENT",
        order: 3,
      },

      // RIESGO
      {
        key: "circulacion",
        label: "Circulación del vehículo",
        required: true,
        type: "RISK",
        expirable: true,
        hasExpirationDate: true,
        order: 4,
      },
    ],

    JURIDICA: [
      // CLIENTE
      {
        key: "ruc",
        label: "RUC de la empresa",
        required: true,
        type: "CLIENT",
        order: 1,
      },
      {
        key: "telefono",
        label: "N° Telefónico",
        required: true,
        type: "CLIENT",
        order: 2,
      },
      {
        key: "direccion",
        label: "Dirección de domicilio",
        required: true,
        type: "CLIENT",
        order: 3,
      },

      // RIESGO
      {
        key: "circulacion",
        label: "Circulación del vehículo",
        required: true,
        type: "RISK",
        expirable: true,
        hasExpirationDate: true,
        order: 4,
      },
    ],
  },

  AUTOMOVIL: {
    NATURAL: [
      // CLIENTE
      {
        key: "cedula",
        label: "Cédula de identidad",
        required: true,
        type: "CLIENT",
        expirable: true,
        hasExpirationDate: true,
        order: 1,
      },
      {
        key: "perfil_cliente",
        label: "Perfil integral del cliente",
        required: true,
        type: "CLIENT",
        order: 2,
      },
      {
        key: "direccion",
        label: "Dirección",
        required: true,
        type: "CLIENT",
        order: 3,
      },
      {
        key: "telefono",
        label: "N° Telefónico",
        required: true,
        type: "CLIENT",
        order: 4,
      },

      // RIESGO
      {
        key: "proforma_circulacion",
        label: "Proforma o circulación",
        required: true,
        type: "RISK",
        order: 5,
      },

      // POLIZA
      {
        key: "cotizacion",
        label: "Cotización de póliza",
        required: true,
        type: "POLICY",
        order: 6,
      },
      {
        key: "solicitud",
        label: "Solicitud de póliza",
        required: true,
        type: "POLICY",
        order: 7,
      },
      {
        key: "poliza_completa",
        label: "Póliza completa",
        required: true,
        type: "POLICY",
        order: 8,
      },
    ],

    JURIDICA: [
      // CLIENTE
      {
        key: "cedula_representante",
        label: "Cédula del representante legal",
        required: true,
        type: "CLIENT",
        order: 1,
      },
      {
        key: "perfil_cliente",
        label: "Perfil integral del cliente",
        required: true,
        type: "CLIENT",
        order: 2,
      },
      {
        key: "ruc",
        label: "RUC",
        required: true,
        type: "CLIENT",
        order: 3,
      },
      {
        key: "beneficiario_final",
        label: "Beneficiario final",
        required: true,
        type: "CLIENT",
        order: 4,
      },
      {
        key: "poder_representacion",
        label: "Poder de representación",
        required: true,
        type: "CLIENT",
        order: 5,
      },
      {
        key: "acta_junta",
        label: "Acta de junta directiva",
        required: true,
        type: "CLIENT",
        order: 6,
      },
      {
        key: "permiso_operaciones",
        label: "Permiso de operaciones",
        required: true,
        type: "CLIENT",
        order: 7,
      },
      {
        key: "direccion",
        label: "Dirección",
        required: true,
        type: "CLIENT",
        order: 8,
      },
      {
        key: "telefono",
        label: "N° Telefónico",
        required: true,
        type: "CLIENT",
        order: 9,
      },

      // RIESGO
      {
        key: "proforma_circulacion",
        label: "Proforma o circulación",
        required: true,
        type: "RISK",
        order: 10,
      },

      // POLIZA
      {
        key: "cotizacion",
        label: "Cotización de póliza",
        required: true,
        type: "POLICY",
        order: 11,
      },
      {
        key: "solicitud",
        label: "Solicitud de póliza",
        required: true,
        type: "POLICY",
        order: 12,
      },
      {
        key: "poliza_completa",
        label: "Póliza completa",
        required: true,
        type: "POLICY",
        order: 13,
      },
    ],
  },
};