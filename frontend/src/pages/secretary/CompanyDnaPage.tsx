import { DashboardLayout } from "../DashboardLayout";
import { SecretarySidebar } from "./SecretarySidebar";

export function CompanyDnaPage() {
  return (
    <DashboardLayout
      title="Company DNA"
      badge="Full access — create & edit"
      sidebar={<SecretarySidebar />}
    >
      <p>
        Company DNA will hold the company's core profile — incorporation
        details, structure, directors, and shareholders — as the source of
        truth other features build on. Not built yet.
      </p>
    </DashboardLayout>
  );
}
