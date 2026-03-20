import type { Kysely } from 'kysely';
import { injectable, inject } from 'tsyringe';
import type { Database } from '../../../shared/postgres/schema.js';
import type { UserDetails } from '../auth.types.js';

@injectable()
export class UsersRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  public async listUsers(): Promise<UserDetails[]> {
    const query = await this.adapter
      .selectFrom('user_details')
      .select(['id', 'email', 'username'])
      .execute();
    if (query) {
      return query;
    }
    return [];
  }
}
