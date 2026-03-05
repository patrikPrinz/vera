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
