import { DashboardLayout } from "../DashboardLayout";

export function SecretaryDashboard() {
  return (
    <DashboardLayout title="Secretary Dashboard" badge="Full access — create & edit">
      <p>
        This is where the secretary will create and manage company records —
        statutory registers, board resolutions, share transfers, and more, as
        those features are built.
      </p>
    </DashboardLayout>
  );
}
