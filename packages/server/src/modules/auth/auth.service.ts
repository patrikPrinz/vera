import { injectable, inject } from 'tsyringe';
import type { AuthRepository } from './auth.repository.js';
import type { AuthenticationRequest } from '../../shared/types/auth/auth.types.js';
import { ValidationError } from '../../shared/error_handler/errors.js';

@injectable()
export class AuthService {
  protected repository: AuthRepository;
  constructor(@inject('AuthRepository') repository: AuthRepository) {
    this.repository = repository;
  }

  postRegisterService = async (
    email: string,
    password: string,
    passwordCheck: string,
  ): Promise<boolean> => {
    if (password !== passwordCheck) {
      throw new ValidationError(
        'Password and password confirmation do not match.',
      );
    }
    const request: AuthenticationRequest = {
      email: email,
      password: password,
      provider: 'local',
      providerAccountId: 'local',
    };
    const register = await this.repository.registerUserAuthentication(request);
    if (register) {
      return true;
    }
    return false;
  };
}
