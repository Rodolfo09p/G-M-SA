import { policiesMockData } from "../../brokerage/data/brokerageMockData";

export const cancelLocalPolicy = (policyNumber: string) => {
  const targetPolicy = policiesMockData.find(
    (policy) => policy.policyNumber === policyNumber,
  );

  if (!targetPolicy) {
    return {
      ok: false,
      error: `No se encontró la póliza ${policyNumber}.`,
    };
  }

  if (targetPolicy.status === "cancelled") {
    return {
      ok: false,
      error: "La póliza ya está anulada.",
    };
  }

  targetPolicy.status = "cancelled";

  return { ok: true };
};
