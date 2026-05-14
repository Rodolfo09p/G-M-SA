import type {
  CollectionArchitectureIndex,
  CollectionArchitectureTable,
  CollectionCaseEntity,
  CollectionCaseView,
  CollectionContactChannel,
  CollectionExcelField,
  CollectionFollowUpOutcome,
  CollectionImportHistoryItem,
  CollectionImportRow,
  CollectionImportSnapshot,
  CollectionImportSummary,
  CollectionOperationalStage,
  CollectionPriority,
} from "../types/types";

const toCaseKey = (row: CollectionImportRow) =>
  `${row.customerId}#${row.policyNumber}#${row.installmentCode}`;

const priorityFromDays = (overdueDays: number): CollectionPriority => {
  if (overdueDays >= 45) {
    return "critical";
  }

  if (overdueDays >= 25) {
    return "high";
  }

  return "medium";
};

const buildCaseFromRow = (
  row: CollectionImportRow,
  snapshot: CollectionImportSnapshot,
): CollectionCaseEntity => ({
  id: `case-${row.customerId}-${row.policyNumber}-${row.installmentCode}`,
  caseKey: toCaseKey(row),
  customerId: row.customerId,
  customerName: row.customerName,
  policyNumber: row.policyNumber,
  installmentCode: row.installmentCode,
  branch: row.branch,
  insuranceCompany: row.insuranceCompany,
  assignedTo: row.assignedTo,
  dueDate: row.dueDate,
  overdueDays: row.overdueDays,
  amountDue: row.amountDue,
  currency: row.currency,
  phone: row.phone,
  email: row.email,
  lastPaymentDate: row.lastPaymentDate,
  priority: priorityFromDays(row.overdueDays),
  operationalStage: "pending_first_call",
  firstSeenSnapshotId: snapshot.id,
  firstSeenAt: snapshot.importedAt,
  lastChangedSnapshotId: snapshot.id,
  lastChangedAt: snapshot.importedAt,
  notes: ["Importado desde Excel de morosidad."],
  followUps: [],
  timeline: [
    {
      id: `${snapshot.id}-${row.customerId}-imported`,
      date: snapshot.importedAt,
      type: "imported",
      title: "Caso creado",
      description: `Detectado por primera vez en ${snapshot.sourceFileName}.`,
      tone: "warning",
    },
  ],
});

const hasMaterialChanges = (currentCase: CollectionCaseEntity, row: CollectionImportRow) => {
  return (
    currentCase.overdueDays !== row.overdueDays ||
    currentCase.amountDue !== row.amountDue ||
    currentCase.dueDate !== row.dueDate ||
    currentCase.assignedTo !== row.assignedTo ||
    currentCase.phone !== row.phone ||
    currentCase.email !== row.email
  );
};

const importSnapshots: CollectionImportSnapshot[] = [
  {
    id: "snapshot-2026-05-01",
    label: "Corte 01 Mayo",
    sourceFileName: "morosos_2026_05_01.xlsx",
    importedAt: "2026-05-01 08:00",
    rows: [
      {
        customerId: "086-210760-0001M",
        customerName: "María López Cabrera",
        policyNumber: "AU-2404-3043",
        installmentCode: "2026-04",
        branch: "Automóvil",
        insuranceCompany: "Lafise",
        assignedTo: "G&M",
        dueDate: "2026-04-25",
        overdueDays: 7,
        amountDue: 185.5,
        currency: "USD",
        phone: "8888-1020",
        email: "maria.lopez@correo.com",
        lastPaymentDate: "2026-03-25",
      },
      {
        customerId: "J0310000183250",
        customerName: "Morales Naturales S.A.",
        policyNumber: "FI-2402-1109",
        installmentCode: "2026-03",
        branch: "Incendio",
        insuranceCompany: "ASSA",
        assignedTo: "Karen Ruiz",
        dueDate: "2026-03-18",
        overdueDays: 45,
        amountDue: 920,
        currency: "USD",
        phone: "8888-1122",
        email: "cobros@moralesnaturales.com",
        lastPaymentDate: "2026-02-18",
      },
      {
        customerId: "001-290796-0005N",
        customerName: "Rodolfo Ramos Ponce",
        policyNumber: "SOA-2501-9921",
        installmentCode: "2026-04",
        branch: "SOA",
        insuranceCompany: "Seguros América",
        assignedTo: "G&M",
        dueDate: "2026-04-20",
        overdueDays: 12,
        amountDue: 48,
        currency: "USD",
        phone: "8888-8888",
        email: "rodolfo.ramos@ejemplo.com",
        lastPaymentDate: "2026-03-20",
      },
    ],
  },
  {
    id: "snapshot-2026-05-04",
    label: "Corte 04 Mayo",
    sourceFileName: "morosos_2026_05_04.xlsx",
    importedAt: "2026-05-04 08:00",
    rows: [
      {
        customerId: "086-210760-0001M",
        customerName: "María López Cabrera",
        policyNumber: "AU-2404-3043",
        installmentCode: "2026-04",
        branch: "Automóvil",
        insuranceCompany: "Lafise",
        assignedTo: "G&M",
        dueDate: "2026-04-25",
        overdueDays: 10,
        amountDue: 185.5,
        currency: "USD",
        phone: "8888-1020",
        email: "maria.lopez@correo.com",
        lastPaymentDate: "2026-03-25",
      },
      {
        customerId: "J0310000183250",
        customerName: "Morales Naturales S.A.",
        policyNumber: "FI-2402-1109",
        installmentCode: "2026-03",
        branch: "Incendio",
        insuranceCompany: "ASSA",
        assignedTo: "Karen Ruiz",
        dueDate: "2026-03-18",
        overdueDays: 48,
        amountDue: 920,
        currency: "USD",
        phone: "8888-1122",
        email: "cobros@moralesnaturales.com",
        lastPaymentDate: "2026-02-18",
      },
      {
        customerId: "901-120182-0007P",
        customerName: "Agroservicios del Norte",
        policyNumber: "TR-2601-0071",
        installmentCode: "2026-04",
        branch: "Transporte",
        insuranceCompany: "Mapfre",
        assignedTo: "Luis Mendoza",
        dueDate: "2026-04-16",
        overdueDays: 18,
        amountDue: 310,
        currency: "USD",
        phone: "8850-4411",
        email: "tesoreria@agroservicios.com",
        lastPaymentDate: "2026-03-16",
      },
    ],
  },
  {
    id: "snapshot-2026-05-07",
    label: "Corte 07 Mayo",
    sourceFileName: "morosos_2026_05_07.xlsx",
    importedAt: "2026-05-07 08:00",
    rows: [
      {
        customerId: "J0310000183250",
        customerName: "Morales Naturales S.A.",
        policyNumber: "FI-2402-1109",
        installmentCode: "2026-03",
        branch: "Incendio",
        insuranceCompany: "ASSA",
        assignedTo: "Karen Ruiz",
        dueDate: "2026-03-18",
        overdueDays: 51,
        amountDue: 920,
        currency: "USD",
        phone: "8888-1122",
        email: "cobros@moralesnaturales.com",
        lastPaymentDate: "2026-02-18",
      },
      {
        customerId: "901-120182-0007P",
        customerName: "Agroservicios del Norte",
        policyNumber: "TR-2601-0071",
        installmentCode: "2026-04",
        branch: "Transporte",
        insuranceCompany: "Mapfre",
        assignedTo: "Luis Mendoza",
        dueDate: "2026-04-16",
        overdueDays: 21,
        amountDue: 355,
        currency: "USD",
        phone: "8850-4411",
        email: "tesoreria@agroservicios.com",
        lastPaymentDate: "2026-03-16",
      },
      {
        customerId: "450-011095-0003A",
        customerName: "Transportes del Pacífico",
        policyNumber: "RC-2509-6610",
        installmentCode: "2026-04",
        branch: "Responsabilidad Civil",
        insuranceCompany: "Seguros América",
        assignedTo: "G&M",
        dueDate: "2026-04-10",
        overdueDays: 27,
        amountDue: 640,
        currency: "USD",
        phone: "8765-2100",
        email: "caja@transportespacifico.com",
        lastPaymentDate: "2026-03-10",
      },
    ],
  },
];

let importedSnapshotIds = [importSnapshots[0].id];

let collectionCases: CollectionCaseEntity[] = importSnapshots[0].rows.map((row) =>
  buildCaseFromRow(row, importSnapshots[0]),
);

collectionCases = collectionCases.map((item) => {
  if (item.customerId === "J0310000183250") {
    return {
      ...item,
      operationalStage: "promise_to_pay",
      notes: [...item.notes, "Cliente indicó pago parcial para el viernes."],
      followUps: [
        {
          id: "followup-morales-1",
          date: "2026-05-02 10:10",
          channel: "call",
          outcome: "promise_to_pay",
          agent: "Karen Ruiz",
          note: "Promesa de pago para el 06 de mayo.",
          nextActionDate: "2026-05-06",
        },
      ],
      timeline: [
        {
          id: "morales-promise",
          date: "2026-05-02 10:10",
          type: "promise",
          title: "Promesa de pago",
          description: "El cliente confirmó pago parcial para la semana en curso.",
          tone: "info",
        },
        ...item.timeline,
      ],
    };
  }

  return item;
});

collectionCases.push({
  id: "case-recovered-historic",
  caseKey: "777-000111-0001Z#VE-2502-1101#2026-02",
  customerId: "777-000111-0001Z",
  customerName: "Clínica Santa Elena",
  policyNumber: "VE-2502-1101",
  installmentCode: "2026-02",
  branch: "Vida Colectivo",
  insuranceCompany: "Mapfre",
  assignedTo: "María Téllez",
  dueDate: "2026-02-12",
  overdueDays: 32,
  amountDue: 510,
  currency: "USD",
  phone: "2222-1100",
  email: "pagos@clinicasantaelena.com",
  lastPaymentDate: "2026-01-12",
  priority: "high",
  operationalStage: "recovered",
  firstSeenSnapshotId: "snapshot-2026-04-25",
  firstSeenAt: "2026-04-25 08:00",
  lastChangedSnapshotId: "snapshot-2026-04-28",
  lastChangedAt: "2026-04-28 08:00",
  recoveredAt: "2026-04-28 08:00",
  recoveredSnapshotId: "snapshot-2026-04-28",
  notes: ["Caso recuperado al desaparecer del Excel siguiente."],
  followUps: [
    {
      id: "followup-clinica-1",
      date: "2026-04-26 09:30",
      channel: "email",
      outcome: "contacted",
      agent: "María Téllez",
      note: "Se envió estado de cuenta con fecha límite.",
      nextActionDate: "2026-04-28",
    },
  ],
  timeline: [
    {
      id: "recovered-clinica",
      date: "2026-04-28 08:00",
      type: "recovered",
      title: "Cliente recuperado",
      description: "Ya no llegó en el siguiente Excel de morosos.",
      tone: "success",
    },
  ],
});

let importHistory: CollectionImportHistoryItem[] = [
  {
    snapshotId: importSnapshots[0].id,
    label: importSnapshots[0].label,
    sourceFileName: importSnapshots[0].sourceFileName,
    importedAt: importSnapshots[0].importedAt,
    summary: {
      totalRows: importSnapshots[0].rows.length,
      newCases: importSnapshots[0].rows.length,
      updatedCases: 0,
      recoveredCases: 0,
      unchangedCases: 0,
    },
  },
];

const deriveSyncState = (item: CollectionCaseEntity): CollectionCaseView["syncState"] => {
  const latestSnapshotId = importedSnapshotIds.at(-1) ?? "";

  if (item.operationalStage === "recovered") {
    return "recovered";
  }

  if (item.firstSeenSnapshotId === latestSnapshotId) {
    return "new";
  }

  if (item.lastChangedSnapshotId === latestSnapshotId) {
    return "updated";
  }

  return "persistent";
};

const asCaseView = (item: CollectionCaseEntity): CollectionCaseView => ({
  ...item,
  syncState: deriveSyncState(item),
});

export const collectionExcelFields: CollectionExcelField[] = [
  { field: "customerId", label: "Cédula / RUC", required: true, example: "086-210760-0001M" },
  { field: "customerName", label: "Cliente", required: true, example: "María López Cabrera" },
  { field: "policyNumber", label: "No. póliza", required: true, example: "AU-2404-3043" },
  { field: "installmentCode", label: "Cuota / período", required: true, example: "2026-04" },
  { field: "branch", label: "Ramo", required: true, example: "Automóvil" },
  { field: "insuranceCompany", label: "Aseguradora", required: true, example: "Lafise" },
  { field: "assignedTo", label: "Asignado", required: false, example: "G&M" },
  { field: "dueDate", label: "Fecha vencimiento", required: true, example: "2026-04-25" },
  { field: "overdueDays", label: "Días mora", required: true, example: "10" },
  { field: "amountDue", label: "Saldo vencido", required: true, example: "185.50" },
  { field: "phone", label: "Teléfono", required: false, example: "8888-1020" },
  { field: "email", label: "Correo", required: false, example: "maria.lopez@correo.com" },
  { field: "lastPaymentDate", label: "Último pago", required: false, example: "2026-03-25" },
];

export const collectionArchitectureTables: CollectionArchitectureTable[] = [
  {
    name: "CollectionsCurrent",
    purpose: "Mantener solo casos activos y recuperaciones recientes sin recorrer toda la cartera.",
    pk: "PK = CASE#{customerId}#{policyNumber}#{installmentCode}",
    sk: "SK = CURRENT",
  },
  {
    name: "CollectionsImports",
    purpose: "Guardar cada corte Excel, hash del archivo y resumen incremental del proceso.",
    pk: "PK = SNAPSHOT#{snapshotId}",
    sk: "SK = META",
  },
  {
    name: "CollectionsTimeline",
    purpose: "Timeline y seguimiento de llamadas sin inflar el item principal del caso.",
    pk: "PK = CASE#{caseId}",
    sk: "SK = EVENT#{timestamp}",
  },
];

export const collectionArchitectureIndexes: CollectionArchitectureIndex[] = [
  {
    name: "GSI1_CurrentByStage",
    usage: "Listar morosos actuales por estado operativo y prioridad.",
    pk: "GSI1PK = STAGE#{operationalStage}",
    sk: "GSI1SK = PRIORITY#{priority}#DUE#{dueDate}",
  },
  {
    name: "GSI2_CurrentByCollector",
    usage: "Vista del gestor y productividad por asignado.",
    pk: "GSI2PK = ASSIGNED#{assignedTo}",
    sk: "GSI2SK = STAGE#{operationalStage}#DAYS#{overdueDays}",
  },
  {
    name: "GSI3_RecoveredByDate",
    usage: "Reportes de recuperados sin escanear todo el histórico.",
    pk: "GSI3PK = RECOVERED#{recoveredSnapshotId}",
    sk: "GSI3SK = DATE#{recoveredAt}",
  },
];

export const collectionFlowSteps = [
  "Subir Excel a S3 y calcular hash del archivo para evitar reprocesos duplicados.",
  "Lambda lee el Excel por streaming y genera un set de llaves activas solo del corte actual.",
  "Por cada fila: buscar solo la llave compuesta del caso; crear si no existe y actualizar solo si cambió algo material.",
  "Comparar llaves activas anteriores vs llaves del corte actual para detectar recuperados sin tocar clientes no involucrados.",
  "Emitir resumen incremental para AppSync, reportes y dashboard operativo.",
];

export const collectionCostTips = [
  "No escanear toda la tabla principal; usar llaves compuestas por caso y GSIs orientados a consulta.",
  "Procesar Excel grande en chunks dentro de Lambda o Step Functions si supera límites de memoria/tiempo.",
  "Guardar timeline en tabla separada para que el item actual del caso se mantenga pequeño y barato.",
  "Generar métricas agregadas por snapshot para que el dashboard lea resúmenes y no detalle crudo.",
];

export const collectionReports = [
  "Morosos actuales por gestor, ramo y antigüedad.",
  "Recuperados por corte y tasa de recuperación por período.",
  "Promesas de pago pendientes de confirmar.",
  "Productividad de llamadas, contactos efectivos y escalados.",
];

export const collectionSyncPseudoCode = [
  "incomingKeys = readExcelRows().map(toCaseKey)",
  "for row in incomingRows: upsert only if case does not exist or material fields changed",
  "recoveredKeys = previousActiveKeys - incomingKeys",
  "for key in recoveredKeys: mark case as recovered and append timeline event",
  "save snapshot summary for dashboard and audit",
];

export const getCollectionImportHistory = () => [...importHistory];

export const getPendingCollectionSnapshots = () => {
  return importSnapshots.filter((item) => !importedSnapshotIds.includes(item.id));
};

export const getLatestImportedSnapshot = () => {
  return importSnapshots.find(
    (item) => item.id === importedSnapshotIds.at(-1),
  ) ?? null;
};

export const getCurrentCollectionCases = () => {
  return collectionCases
    .filter((item) => item.operationalStage !== "recovered")
    .map(asCaseView)
    .sort((left, right) => right.overdueDays - left.overdueDays);
};

export const getRecoveredCollectionCases = () => {
  return collectionCases
    .filter((item) => item.operationalStage === "recovered")
    .map(asCaseView)
    .sort((left, right) => (right.recoveredAt ?? "").localeCompare(left.recoveredAt ?? ""));
};

export const getCollectionDashboardMetrics = () => {
  const activeCases = getCurrentCollectionCases();
  const recoveredCases = getRecoveredCollectionCases();
  const latestImport = importHistory[0]?.summary;
  const activeAmount = activeCases.reduce((acc, item) => acc + item.amountDue, 0);
  const promiseCases = activeCases.filter((item) => item.operationalStage === "promise_to_pay").length;
  const recoveryRate =
    activeCases.length + recoveredCases.length === 0
      ? 0
      : Math.round((recoveredCases.length / (activeCases.length + recoveredCases.length)) * 100);

  return [
    {
      title: "Morosos actuales",
      value: `${activeCases.length}`,
      description: `Saldo en riesgo ${activeAmount.toFixed(2)} USD`,
      icon: "lucide:wallet-cards",
      accentColor: "#C62828",
    },
    {
      title: "Nuevos en último corte",
      value: `${latestImport?.newCases ?? 0}`,
      description: "Detectados solo al importar el último Excel.",
      icon: "lucide:file-plus-2",
      accentColor: "#EF6C00",
    },
    {
      title: "Recuperados",
      value: `${recoveredCases.length}`,
      description: `Tasa de recuperación ${recoveryRate}%`,
      icon: "lucide:badge-check",
      accentColor: "#2E7D32",
    },
    {
      title: "Promesas de pago",
      value: `${promiseCases}`,
      description: "Casos en seguimiento activo por promesa.",
      icon: "lucide:phone-call",
      accentColor: "#1565C0",
    },
  ];
};

export const getCollectionChartsData = () => {
  const activeCases = getCurrentCollectionCases();
  const recoveredCases = getRecoveredCollectionCases();
  const recoveredPercent =
    activeCases.length + recoveredCases.length === 0
      ? 0
      : Math.round((recoveredCases.length / (activeCases.length + recoveredCases.length)) * 100);

  return {
    pieData: [
      { label: "Recuperado", percent: recoveredPercent, color: "#66BB6A" },
      { label: "En mora", percent: 100 - recoveredPercent, color: "#F59E0B" },
    ],
    barData: [
      { month: "Feb", collected: 58, arrears: 42 },
      { month: "Mar", collected: 62, arrears: 38 },
      { month: "Abr", collected: 67, arrears: 33 },
      { month: "May", collected: 71, arrears: 29 },
    ],
  };
};

export const applyMockCollectionSnapshot = (snapshotId: string) => {
  const snapshot = importSnapshots.find((item) => item.id === snapshotId);

  if (!snapshot) {
    return { ok: false as const, error: "No se encontró el corte seleccionado." };
  }

  if (importedSnapshotIds.includes(snapshotId)) {
    return { ok: false as const, error: "Ese Excel ya fue procesado." };
  }

  const incomingRowsByKey = new Map(snapshot.rows.map((row) => [toCaseKey(row), row]));
  const activeCases = collectionCases.filter((item) => item.operationalStage !== "recovered");
  const activeCasesByKey = new Map(activeCases.map((item) => [item.caseKey, item]));
  const summary: CollectionImportSummary = {
    totalRows: snapshot.rows.length,
    newCases: 0,
    updatedCases: 0,
    recoveredCases: 0,
    unchangedCases: 0,
  };

  snapshot.rows.forEach((row) => {
    const caseKey = toCaseKey(row);
    const existingCase = activeCasesByKey.get(caseKey);

    if (!existingCase) {
      collectionCases.unshift(buildCaseFromRow(row, snapshot));
      summary.newCases += 1;
      return;
    }

    if (!hasMaterialChanges(existingCase, row)) {
      summary.unchangedCases += 1;
      return;
    }

    existingCase.assignedTo = row.assignedTo;
    existingCase.dueDate = row.dueDate;
    existingCase.overdueDays = row.overdueDays;
    existingCase.amountDue = row.amountDue;
    existingCase.phone = row.phone;
    existingCase.email = row.email;
    existingCase.priority = priorityFromDays(row.overdueDays);
    existingCase.lastChangedSnapshotId = snapshot.id;
    existingCase.lastChangedAt = snapshot.importedAt;
    existingCase.timeline.unshift({
      id: `${snapshot.id}-${existingCase.id}-updated`,
      date: snapshot.importedAt,
      type: "updated",
      title: "Caso actualizado",
      description: "Cambió saldo, días de mora o asignación en el nuevo Excel.",
      tone: "info",
    });
    summary.updatedCases += 1;
  });

  activeCases.forEach((item) => {
    if (incomingRowsByKey.has(item.caseKey)) {
      return;
    }

    item.operationalStage = "recovered";
    item.recoveredAt = snapshot.importedAt;
    item.recoveredSnapshotId = snapshot.id;
    item.lastChangedSnapshotId = snapshot.id;
    item.lastChangedAt = snapshot.importedAt;
    item.timeline.unshift({
      id: `${snapshot.id}-${item.id}-recovered`,
      date: snapshot.importedAt,
      type: "recovered",
      title: "Cliente recuperado",
      description: "No apareció en el nuevo Excel de morosos.",
      tone: "success",
    });
    summary.recoveredCases += 1;
  });

  importedSnapshotIds = [...importedSnapshotIds, snapshot.id];
  importHistory = [
    {
      snapshotId: snapshot.id,
      label: snapshot.label,
      sourceFileName: snapshot.sourceFileName,
      importedAt: snapshot.importedAt,
      summary,
    },
    ...importHistory,
  ];

  return {
    ok: true as const,
    summary,
    snapshot,
  };
};

export const recordCollectionFollowUp = (args: {
  caseId: string;
  channel: CollectionContactChannel;
  outcome: CollectionFollowUpOutcome;
  note: string;
  agent: string;
  nextActionDate: string;
}) => {
  const selectedCase = collectionCases.find((item) => item.id === args.caseId);

  if (!selectedCase) {
    return { ok: false as const, error: "No se encontró el caso seleccionado." };
  }

  const note = args.note.trim();

  if (!note) {
    return { ok: false as const, error: "Debes ingresar una observación." };
  }

  const stageByOutcome: Record<CollectionFollowUpOutcome, CollectionOperationalStage> = {
    contacted: "in_follow_up",
    promise_to_pay: "promise_to_pay",
    no_answer: selectedCase.operationalStage,
    escalated: "escalated",
  };

  selectedCase.operationalStage = stageByOutcome[args.outcome];
  selectedCase.lastChangedAt = args.nextActionDate;
  selectedCase.notes.unshift(note);
  selectedCase.followUps.unshift({
    id: `followup-${selectedCase.id}-${selectedCase.followUps.length + 1}`,
    date: args.nextActionDate,
    channel: args.channel,
    outcome: args.outcome,
    agent: args.agent,
    note,
    nextActionDate: args.nextActionDate,
  });
  selectedCase.timeline.unshift({
    id: `timeline-${selectedCase.id}-${selectedCase.timeline.length + 1}`,
    date: args.nextActionDate,
    type: args.outcome === "promise_to_pay" ? "promise" : "follow_up",
    title: "Seguimiento registrado",
    description: `${args.agent} registró ${args.channel} con resultado ${args.outcome}.`,
    tone: args.outcome === "escalated" ? "error" : "info",
  });

  return { ok: true as const };
};
