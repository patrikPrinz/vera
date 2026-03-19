import type { Axios } from 'axios';
import {
  logoutResponseSchema,
  userDetailsResponseSchema,
  userRolesResponseSchema,
} from './authService.schema';
import { HttpError } from '@/shared/httpClient/http.errors';
import type {
  UserDetails,
  UserRoleRecord,
} from '@/shared/types/auth/auth.types';

export interface IAuthService {
  login(login: string, password: string): Promise<boolean>;
  logout(): Promise<boolean>;
  isLoggedIn(): Promise<boolean>;
  userDetails(): Promise<UserDetails | undefined>;
  userRoles(userId: string): Promise<UserRoleRecord[]>;
  hasRoles(roles: string[]): Promise<boolean>;
}

export class AuthService implements IAuthService {
  protected client: Axios;
  constructor(client: Axios) {
    this.client = client;
  }

  public async login(login: string, password: string) {
    const response = await this.client.post('auth/login', {
      login: login,
      password: password,
    });
    if (response.status != 401) {
      return true;
    }
    if (response.status == 401) {
      return false;
    }
    throw new HttpError();
  }

  public async logout() {
    const response = await this.client.post('auth/logout');
    if (logoutResponseSchema.safeParse(response.data).success) {
      return true;
    }
    if (response.status == 401) {
      return false;
    }
    throw new HttpError();
  }

  public async register(
    email: string,
    password: string,
    passwordCheck: string,
  ): Promise<boolean> {
    const response = await this.client.post('auth/register', {
      email: email,
      password: password,
      passwordCheck: passwordCheck,
    });
    if (response.status == 200) {
      return true;
    }
    // TODO: check if email is taken (400)
    return false;
  }

  public async userDetails(): Promise<UserDetails | undefined> {
    const response = await this.client.get('auth/me');
    if (response.status == 401) {
      return undefined;
    }
    const validatedData = userDetailsResponseSchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data;
    }
    throw new HttpError();
  }

  public async isLoggedIn(): Promise<boolean> {
    return (await this.userDetails()) !== undefined;
  }

  public async userRoles(userId: string): Promise<UserRoleRecord[]> {
    const response = await this.client.get(`/admin/user-roles/${userId}`);
    if (response.status == 401) {
      return [];
    }
    const validatedData = userRolesResponseSchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data as UserRoleRecord[];
    }
    throw new HttpError();
  }

  public async hasRoles(roles: string[]): Promise<boolean> {
    const hasRoles = await this.client.post('/auth/has-roles', roles);
    if (hasRoles.status == 401) {
      return false;
    }
    if (hasRoles.data) {
      return hasRoles.data as boolean;
    }
    throw new HttpError();
  }
}
