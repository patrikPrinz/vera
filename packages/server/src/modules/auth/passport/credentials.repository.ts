import { inject, injectable } from 'tsyringe';
import bcrypt from 'bcrypt';
import { type Database } from '../../../shared/postgres/schema.js';
import type { Kysely } from 'kysely';
import type { UserCredentials } from './local_strategy.types.js';

@injectable()
export class CredentialsRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  /**
   * Returns id of matching user. If there is no matching user, returns undefined.
   * @param username
   * @param password
   */
  public async verifyUser(
    username: string,
    password: string,
  ): Promise<UserCredentials | undefined> {
    const query = await this.adapter
      .selectFrom('user_details')
      .innerJoin('authentication', 'user_details.id', 'authentication.user_id')
      .rightJoin(
        'credentials',
        'authentication.id',
        'credentials.authentication_id',
      )
      .select([
        'user_details.id',
        'user_details.username',
        'user_details.email',
        'credentials.password_hash',
      ])
      .where('user_details.email', '=', username)
      .executeTakeFirst();

    if (query) {
      const passwordHash = query.password_hash;
      const passwordMatch = await bcrypt.compare(password, passwordHash);
      return passwordMatch
        ? { id: Number(query.id), login: query.username }
        : undefined;
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getUserById(id: number): Promise<UserCredentials | undefined> {
    const query = await this.adapter
      .selectFrom('user_details')
      .select(['id', 'username'])
      .where('id', '=', String(id))
      .execute();
    if (query.length) {
      const user = query[0];
      return { id: Number(user.id), login: user.username };
    }
  }
}
