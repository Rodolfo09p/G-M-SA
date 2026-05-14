import { ClaimEntity, ClaimStatus, NewClaimPayload } from "../types/types";

const CLAIMS_NOTIFICATIONS_UPDATED_EVENT = "gm:claims-notifications-updated";

const CLAIM_STATUS_FLOW: ClaimStatus[] = [
  "reported",
  "in_review",
  "documents_pending",
  "approved",
  "closed",
];

const TODAY_ISO = new Date().toISOString().slice(0, 10);

const createNotificationId = () =>
  `NTF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const notifyClaimsNotificationsUpdated = () => {
  if (globalThis.window === undefined) {
    return;
  }

  globalThis.window.dispatchEvent(new Event(CLAIMS_NOTIFICATIONS_UPDATED_EVENT));
};

const getNextClaimNumber = () => {
  const maxNumber = claimsMockData.reduce((currentMax, claim) => {
    const match = /REC-(\d{4})-(\d+)/.exec(claim.claimNumber);

    if (!match) {
      return currentMax;
    }

    const numericPart = Number(match[2]);
    return Number.isNaN(numericPart) ? currentMax : Math.max(currentMax, numericPart);
  }, 0);

  const year = new Date().getFullYear();
  const next = String(maxNumber + 1).padStart(4, "0");

  return `REC-${year}-${next}`;
};

const getNextStatus = (status: ClaimStatus): ClaimStatus | null => {
  const currentIndex = CLAIM_STATUS_FLOW.indexOf(status);

  if (currentIndex < 0 || currentIndex === CLAIM_STATUS_FLOW.length - 1) {
    return null;
  }

  return CLAIM_STATUS_FLOW[currentIndex + 1];
};

const claimsMockData: ClaimEntity[] = [
  {
    claimNumber: "REC-2026-0001",
    policyNumber: "SOA-2026-0340",
    customerId: "001-120390-1025A",
    customerName: "Ana Lucía Pérez",
    branch: "SOA",
    assignmentType: "gym",
    assignedTo: "Gabriel Cordero",
    status: "reported",
    occurrenceDate: "2026-05-02",
    reportDate: "2026-05-03",
    claimedAmount: 850,
    currency: "USD",
    description: "Colisión leve en intersección semaforizada.",
    checklist: {
      incidentReport: true,
      insuredIdCopy: true,
      policyCopy: true,
      photos: false,
    },
    notifications: [
      {
        id: "NTF-001",
        category: "Documentos",
        message: "Faltan fotografías del incidente.",
        createdAt: "2026-05-03",
        read: false,
      },
    ],
  },
  {
    claimNumber: "REC-2026-0002",
    policyNumber: "AUT-2026-0142",
    customerId: "001-150490-1020B",
    customerName: "Marco Antonio Rivas",
    branch: "Automóvil",
    assignmentType: "agent",
    assignedTo: "Subagente Rivera",
    status: "in_review",
    occurrenceDate: "2026-04-25",
    reportDate: "2026-04-26",
    claimedAmount: 3200,
    currency: "USD",
    description: "Daño de puerta y guardafango por impacto lateral.",
    checklist: {
      incidentReport: true,
      insuredIdCopy: true,
      policyCopy: true,
      photos: true,
    },
    notifications: [
      {
        id: "NTF-002",
        category: "Inspección",
        message: "Inspección programada para el 14/05/2026.",
        createdAt: "2026-05-10",
        read: false,
      },
      {
        id: "NTF-003",
        category: "Legal",
        message: "Se validó parte policial sin observaciones.",
        createdAt: "2026-05-11",
        read: true,
      },
    ],
  },
  {
    claimNumber: "REC-2026-0003",
    policyNumber: "HLG-2025-9910",
    customerId: "J031000902",
    customerName: "Comercial El Trébol, S.A.",
    branch: "Hogar",
    assignmentType: "gym",
    assignedTo: "Mónica Aráuz",
    status: "documents_pending",
    occurrenceDate: "2026-03-18",
    reportDate: "2026-03-19",
    claimedAmount: 12500,
    currency: "USD",
    description: "Daños por fuga de agua en bodega principal.",
    checklist: {
      incidentReport: true,
      insuredIdCopy: true,
      policyCopy: false,
      photos: true,
    },
    notifications: [
      {
        id: "NTF-004",
        category: "Documentos",
        message: "Pendiente copia vigente de póliza firmada.",
        createdAt: "2026-03-20",
        read: false,
      },
      {
        id: "NTF-005",
        category: "Pago",
        message: "Se estimó anticipo provisional de indemnización.",
        createdAt: "2026-03-21",
        read: true,
      },
    ],
  },
];

const createLocalClaim = (payload: NewClaimPayload) => {
  const duplicate = claimsMockData.some(
    (claim) =>
      claim.policyNumber.toLowerCase() === payload.policyNumber.trim().toLowerCase() &&
      claim.occurrenceDate === payload.occurrenceDate,
  );

  if (duplicate) {
    return {
      ok: false as const,
      error: "Ya existe un reclamo para esta póliza en la misma fecha de ocurrencia.",
    };
  }

  const claimNumber = getNextClaimNumber();

  const newClaim: ClaimEntity = {
    claimNumber,
    policyNumber: payload.policyNumber.trim().toUpperCase(),
    customerId: payload.customerId.trim(),
    customerName: payload.customerName.trim(),
    branch: payload.branch.trim(),
    assignmentType: payload.assignmentType,
    assignedTo: payload.assignedTo.trim(),
    status: "reported",
    occurrenceDate: payload.occurrenceDate,
    reportDate: TODAY_ISO,
    claimedAmount: payload.claimedAmount,
    currency: "USD",
    description: payload.description.trim(),
    checklist: {
      incidentReport: true,
      insuredIdCopy: false,
      policyCopy: false,
      photos: false,
    },
    notifications: [
      {
        id: createNotificationId(),
        category: "Documentos",
        message: "Reclamo registrado. Pendiente carga de documentos iniciales.",
        createdAt: TODAY_ISO,
        read: false,
      },
    ],
  };

  claimsMockData.unshift(newClaim);
  notifyClaimsNotificationsUpdated();

  return { ok: true as const, claimNumber };
};

const advanceLocalClaimStatus = (claimNumber: string) => {
  const claim = claimsMockData.find((item) => item.claimNumber === claimNumber);

  if (!claim) {
    return { ok: false as const, error: "No se encontró el reclamo." };
  }

  if (claim.status === "rejected" || claim.status === "closed") {
    return {
      ok: false as const,
      error: "Este reclamo ya no permite avance de estado.",
    };
  }

  const nextStatus = getNextStatus(claim.status);

  if (!nextStatus) {
    return {
      ok: false as const,
      error: "No hay un siguiente estado configurado para este reclamo.",
    };
  }

  claim.status = nextStatus;
  claim.notifications.unshift({
    id: createNotificationId(),
    category: "Inspección",
    message: `El reclamo avanzó al estado ${nextStatus}.`,
    createdAt: TODAY_ISO,
    read: false,
  });

  notifyClaimsNotificationsUpdated();

  return { ok: true as const, nextStatus };
};

const markClaimNotificationAsRead = (notificationId: string) => {
  for (const claim of claimsMockData) {
    const notification = claim.notifications.find((item) => item.id === notificationId);

    if (!notification) {
      continue;
    }

    notification.read = true;
    notifyClaimsNotificationsUpdated();
    return { ok: true as const };
  }

  return { ok: false as const, error: "No se encontró la notificación." };
};

const markAllClaimNotificationsAsRead = () => {
  claimsMockData.forEach((claim) => {
    claim.notifications.forEach((notification) => {
      notification.read = true;
    });
  });

  notifyClaimsNotificationsUpdated();
};

const mapClaimCategoryToQuickType = (category: string) => {
  if (category === "Pago") {
    return "payment" as const;
  }

  if (category === "Inspección") {
    return "renewal" as const;
  }

  return "document" as const;
};

const getQuickPanelNotificationsFromClaims = (limit = 3) => {
  const items = claimsMockData
    .flatMap((claim) =>
      claim.notifications.map((notification) => ({
        id: `claim-${notification.id}`,
        title: `Reclamo ${claim.claimNumber}`,
        detail: notification.message,
        type: mapClaimCategoryToQuickType(notification.category),
        createdAt: notification.createdAt,
        read: notification.read,
      })),
    )
    .filter((notification) => !notification.read)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return items.slice(0, limit);
};

const subscribeToClaimsNotificationsUpdated = (callback: () => void) => {
  if (globalThis.window === undefined) {
    return () => {};
  }

  const listener = () => callback();
  globalThis.window.addEventListener(CLAIMS_NOTIFICATIONS_UPDATED_EVENT, listener);

  return () => {
    globalThis.window.removeEventListener(CLAIMS_NOTIFICATIONS_UPDATED_EVENT, listener);
  };
};

export {
  CLAIM_STATUS_FLOW,
  claimsMockData,
  createLocalClaim,
  advanceLocalClaimStatus,
  markClaimNotificationAsRead,
  markAllClaimNotificationsAsRead,
  getQuickPanelNotificationsFromClaims,
  subscribeToClaimsNotificationsUpdated,
};