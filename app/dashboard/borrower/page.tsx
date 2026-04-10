import { RoleDashboardScreen } from "@/components/dashboard/RoleDashboardScreen";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function BorrowerDashboardPage() {
  await requireAuthenticatedUser("borrower");

  return (
    <RoleDashboardScreen
      expectedRole="borrower"
      heading="Borrower workspace"
      description="Track credit access, repayment progress, and trust growth from real financial behavior."
      metrics={[
        { label: "Current trust score", value: "214" },
        { label: "Available credit", value: "$2,450" },
        { label: "On-time repayment", value: "98.2%" },
      ]}
      primaryHref="#"
      primaryLabel="Request a loan"
      secondaryHref="#"
      secondaryLabel="View repayment plan"
    />
  );
}
