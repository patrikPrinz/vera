import bcrypt from 'bcrypt';
import { Kysely } from 'kysely';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/error_handler/errors.js';
import { PostgresError } from '../../../shared/postgres/postgres.errors.js';
import { type Database } from '../../../shared/postgres/schema.js';
import type {
  AuthenticationRequest,
  AuthProvider,
  UserDetails,
} from '../../../shared/types/auth/auth.types.js';

@injectable()
export class AuthRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  public async findUserByEmail(
    email: string,
  ): Promise<UserDetails | undefined> {
    const query = await this.adapter
      .selectFrom('user_details')
      .select(['id', 'email', 'username'])
      .where('email', '=', email)
      .executeTakeFirst();
    if (!query) {
      return undefined;
    }
    return {
      id: query.id,
      email: query.email,
      username: query.username,
    };
  }

  public async findUserById(id: string): Promise<UserDetails | undefined> {
    const query = await this.adapter
      .selectFrom('user_details')
      .select(['id', 'email', 'username'])
      .where('id', '=', id)
      .executeTakeFirst();
    if (!query) {
      return undefined;
    }
    return {
      id: query.id,
      email: query.email,
      username: query.username,
    };
  }

  /**
   * Return login methods already registered for user with `email`
   * @param email email address of the user
   * @param provider provider of the specified method
   */
  protected async findUserMethods(
    email: string,
  ): Promise<string[] | undefined> {
    const query = await this.adapter
      .selectFrom('user_details')
      .leftJoin('authentication', 'user_details.id', 'authentication.user_id')
      .innerJoin(
        'auth_provider',
        'authentication.provider_id',
        'auth_provider.id',
      )
      .select(['user_details.id', 'auth_provider.code'])
      .where('user_details.email', '=', email)
      .execute();
    if (query.length == 0) return [];
    const result = query.map((e) => e.code);
    return result;
  }

  protected async findProviderByCode(
    code: string,
  ): Promise<AuthProvider | undefined> {
    const query = await this.adapter
      .selectFrom('auth_provider')
      .select(['id', 'code', 'name'])
      .where('code', '=', code)
      .executeTakeFirst();
    if (!query) return undefined;
    return { id: query.id, code: query.code, name: query.name } as AuthProvider;
  }

  /**
   * Register user, if he is not registered yet with specified authentication method.
   * @returns user's `id` if registered successfully, `undefined` if already registered
   */
  public async registerUserAuthentication(
    request: AuthenticationRequest,
  ): Promise<string | undefined> {
    const registeredMethods = await this.findUserMethods(request.email);
    if (!registeredMethods.includes(request.provider)) {
      let userId: string;
      if (registeredMethods.length == 0) {
        userId = await this.insertUserDetails(request);
      } else {
        userId = (await this.findUserByEmail(request.email)).id;
      }
      if (request.provider === 'local') {
        request.providerAccountId = `local<${userId}>`;
        const authId = await this.insertAuthenticationMethod(userId, request);
        const _credentialsId = await this.insertCredentials(authId, request);
        return userId;
      }
      await this.insertAuthenticationMethod(userId, request);
      return userId;
    }
    return undefined;
  }

  protected async insertUserDetails(
    request: AuthenticationRequest,
  ): Promise<string> {
    const query = await this.adapter
      .insertInto('user_details')
      .values({ email: request.email })
      .returning('id')
      .executeTakeFirst();
    if (query) {
      return query.id;
    } else throw new PostgresError();
  }

  protected async insertAuthenticationMethod(
    id: string,
    request: AuthenticationRequest,
  ): Promise<string | undefined> {
    const provider = await this.findProviderByCode(request.provider);
    if (!provider) {
      throw new AppError(
        500,
        'SERVER_ERROR',
        'Authentication strategy not found in DB.',
      );
    }
    // TODO: check provider_account_id
    const query = await this.adapter
      .insertInto('authentication')
      .values({
        provider_id: provider.id,
        user_id: id,
        provider_account_identifier: request.providerAccountId,
      })
      .returning('id')
      .executeTakeFirst();
    if (query) {
      return query.id;
    }
  }

  protected async insertCredentials(
    authId: string,
    request: AuthenticationRequest,
  ): Promise<string | undefined> {
    const passwordHash = bcrypt.hashSync(request.password, 10);
    const query = await this.adapter
      .insertInto('credentials')
      .values({
        authentication_id: authId,
        password_hash: passwordHash,
      })
      .returning('id')
      .executeTakeFirst();

    if (query) {
      return query.id;
    }
    throw new PostgresError();
  }
}
