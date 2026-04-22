export const mapPoliciesToRows = (
  policies,
  customers,
  finances
) => {
  return policies.map((policy) => {
    const customer = customers.find(
      (item) => item.id === policy.customerId
    );

    const finance = finances.find(
      (item) => item.policyNumber === policy.policyNumber
    );

    return {
      id: policy.policyNumber,
      policyNumber: policy.policyNumber,
      customerName: customer?.fullName ?? "Sin cliente",
      branch: policy.branch,
      insuranceCompany: policy.insuranceCompany,
      status: policy.status === "active" ? "Activa" : "Anulada",
      assignedTo: policy.assignedTo,
      assignmentType: policy.assignmentType,
      startDate: policy.startDate,
      endDate: policy.endDate,
      insuredAssetDescription: policy.insuredAssetDescription,
      customerId: customer?.id ?? policy.customerId,
      paymentMethod: finance?.paymentMethod ?? "N/A",
      installments: finance?.installments ?? 0,
      installmentValue: finance?.installmentValue ?? 0,
      netPremium: finance?.netPremium ?? 0,
      insuredSum: finance?.insuredSum ?? 0,
      totalPremium: finance?.totalPremium ?? 0,
      currency: finance?.currency ?? "USD",
    };
  });
};