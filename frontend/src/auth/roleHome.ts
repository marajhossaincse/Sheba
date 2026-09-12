import type { Role } from "../api/client";

// Single place that maps a role to its dashboard root — used by both the
// post-login redirect and the route guard, so they can never disagree.
export function roleHome(role: Role): string {
  switch (role) {
    case "SECRETARY":
      return "/app/secretary";
    case "DIRECTOR":
      return "/app/director";
    case "SHAREHOLDER":
      return "/app/shareholder";
  }
}
