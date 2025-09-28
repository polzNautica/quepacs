export const ROLES = {
  ADMIN: 1,
  AHLI: 2,
  AGENT: 3,
} as const;

export type RoleType = keyof typeof ROLES;

export const hasRole = (userRoleId: number, allowedRoles: number[]): boolean => {
  return allowedRoles.includes(userRoleId);
};
