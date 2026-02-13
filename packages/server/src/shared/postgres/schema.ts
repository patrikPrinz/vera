import type { Generated } from 'kysely';

export interface Database {
  user_details: UserDetailsTable;
  auth_provider: AuthProviderTable;
  authentication: AuthenticationTable;
  credentials: CredentialsTable;
}

export interface UserDetailsTable {
  id: Generated<string>;
  username: string | null;
  email: string;
}

export interface AuthProviderTable {
  id: Generated<number>;
  code: string;
  name: string;
}
export interface AuthenticationTable {
  id: Generated<string>;
  user_id: string;
  provider_id: number;
  provider_account_identifier: string;
}

export interface CredentialsTable {
  id: Generated<string>;
  authentication_id: string;
  password_hash: string;
}
