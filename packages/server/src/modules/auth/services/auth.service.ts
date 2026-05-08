import { injectable, inject } from 'tsyringe';
import type { AuthRepository } from '../repositories/auth.repository.js';
import type {
  AuthenticationRequest,
  User,
  UserDetails,
} from '../../../shared/types/auth/auth.types.js';
import {
  AuthError,
  ValidationError,
} from '../../../shared/error_handler/errors.js';
import { RolesService } from './roles.service.js';

@injectable()
export class AuthService {
  protected repository: AuthRepository;
  protected rolesService: RolesService;
  constructor(
    @inject('AuthRepository') repository: AuthRepository,
    @inject('RolesService') rolesService: RolesService,
  ) {
    this.repository = repository;
    this.rolesService = rolesService;
  }

  postRegisterService = async (
    email: string,
    password: string,
    passwordCheck: string,
  ): Promise<string | undefined> => {
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
    return register;
  };

  getUserDetails = async (id: string): Promise<UserDetails | undefined> => {
    return await this.repository.findUserById(id);
  };

  async resetUserPassword(
    author: User,
    userId: string,
    newPassword: string,
    newPasswordCheck: string,
  ) {
    if (newPassword !== newPasswordCheck) {
      throw new ValidationError('Password check is not correct');
    }
    if (
      (await this.rolesService.hasRole(author, ['admin'])) ||
      author.id == userId
    ) {
      await this.repository.resetPassword(userId, newPassword);
      return true;
    }
    throw new AuthError('User not permitted to perform this action.');
  }
}
