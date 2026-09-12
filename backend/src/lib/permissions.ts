import { Role } from "@prisma/client";

// Single source of truth for what each role can do. Adding a new role later
// (e.g. AUDITOR) means adding one entry here, not hunting for scattered
// `if (role === 'SECRETARY')` checks across the codebase.
export const PERMISSIONS: Record<
  Role,
  { canWrite: boolean; canView: boolean; canDownload: boolean }
> = {
  SECRETARY: { canWrite: true, canView: true, canDownload: true },
  DIRECTOR: { canWrite: false, canView: true, canDownload: true },
  SHAREHOLDER: { canWrite: false, canView: true, canDownload: true },
};

export type Capability = keyof (typeof PERMISSIONS)[Role];

export function roleHas(role: Role, capability: Capability): boolean {
  return PERMISSIONS[role][capability];
}
