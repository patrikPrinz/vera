export interface AuthenticationRequest {
  email: string;
  provider: string;
  providerAccountId: string;
  password?: string;
}

export interface User {
  id: string;
}

export interface UserDetails {
  id: string;
  email: string;
  username?: string;
}

export interface AuthProvider {
  id: number;
  code: string;
  name: string;
}

export interface User {
  id: string;
}

export interface Role {
  id?: string;
  code: string;
  name?: string;
  groupRole: boolean;
}

export interface UserRole {
  userId: string;
  roleId: string;
  group?: string;
}

export interface UserRoleRecord {
  code: string;
  name?: string;
  group?: string;
}

export interface Group {
  id?: string;
  name: string;
}
