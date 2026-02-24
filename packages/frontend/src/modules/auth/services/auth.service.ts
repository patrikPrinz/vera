import type { Axios } from 'axios';
import {
  logoutResponseSchema,
  userDetailsResponseSchema,
} from './authService.schema';
import { HttpError } from '@/shared/httpClient/http.errors';
import type { UserDetails } from '@/shared/types/auth/auth.types';

export interface IAuthService {
  login(login: string, password: string): Promise<boolean>;
  logout(): Promise<boolean>;
  isLoggedIn(): Promise<boolean>;
  userDetails(): Promise<UserDetails | undefined>;
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
    /*if (loginResponseSchema.safeParse(response.data).success) {
      return true;
      }*/
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
}
