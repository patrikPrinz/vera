import type { Kysely } from 'kysely';
import { inject, injectable } from 'tsyringe';
import type { Database } from '../../../shared/postgres/schema.js';
import type { Group, User } from '../../auth/auth.types.js';
import type { DatabaseError } from 'pg';
import { ConflictError } from '../../../shared/error_handler/errors.js';

@injectable()
export class GroupsRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  public async insertGroup(group: Group): Promise<string | undefined> {
    const query = await this.adapter
      .insertInto('groups')
      .values({
        name: group.name,
      })
      .returning('id')
      .executeTakeFirst();
    if (query) {
      return query.id;
    }
    return undefined;
  }

  public async deleteGroup(id: string): Promise<bigint> {
    try {
      const query = await this.adapter
        .deleteFrom('roles')
        .where('id', '=', id)
        .executeTakeFirst();
      return query.numDeletedRows;
    } catch (err: unknown) {
      if ((err as DatabaseError).code === '23503') {
        throw new ConflictError("Can't remove group with assigned members.");
      }
    }
  }

  public async updateGroup(group: Group): Promise<string | undefined> {
    if (group.id) {
      const query = await this.adapter
        .updateTable('roles')
        .set({
          name: group.name,
        })
        .where('id', '=', group.id)
        .returning('id')
        .executeTakeFirst();
      if (query) {
        return query.id;
      }
      return undefined;
    }
    throw new ReferenceError('Id not specified in Group object');
  }

  public async listGroups(): Promise<Group[]> {
    const query = await this.adapter
      .selectFrom('groups')
      .select(['id', 'name'])
      .execute();
    if (query) {
      const groups = query.map((e) => ({
        id: e.id,
        name: e.name,
      })) as Group[];

      return groups;
    }
    return [];
  }

  public async addToGroup(
    userId: string,
    groupId: string,
  ): Promise<string | undefined> {
    const query = await this.adapter
      .insertInto('user_groups')
      .values({
        user_id: userId,
        group_id: groupId,
      })
      .returning('id')
      .executeTakeFirst();
    if (query) {
      return query.id;
    }
    return undefined;
  }

  public async removeFromGroup(
    userId: string,
    groupId: string,
  ): Promise<bigint> {
    const query = await this.adapter
      .deleteFrom('user_groups')
      .where('user_id', '=', userId)
      .where('group_id', '=', groupId)
      .executeTakeFirst();
    return query.numDeletedRows;
  }

  public async isInGroup(userId: string, group: Group): Promise<boolean> {
    const query = await this.adapter
      .selectFrom('user_groups')
      .innerJoin('groups', 'user_groups.group_id', 'groups.id')
      .select('user_groups.id')
      .where('user_groups.user_id', '=', userId)
      .where('groups.id', '=', group.id)
      .execute();

    if (query.length > 0) {
      return true;
    }
    return false;
  }

  public async listGroupUsers(groupId: string): Promise<User[]> {
    const query = await this.adapter
      .selectFrom('user_groups')
      .innerJoin('user_details', 'user_details.id', 'user_groups.user_id')
      .select([
        'user_details.id',
        'user_details.username',
        'user_details.email',
      ])
      .where('user_groups.group_id', '=', groupId)
      .execute();
    if (query.length > 0) {
      return query.map((e) => ({
        id: e.id,
        username: e.username,
        email: e.email,
      }));
    }
    return [];
  }

  public async listUserGroups(userId: string): Promise<Group[]> {
    const query = await this.adapter
      .selectFrom('user_groups')
      .innerJoin('groups', 'user_groups.group_id', 'groups.id')
      .select(['groups.id', 'groups.name'])
      .where('user_id', '=', userId)
      .execute();

    if (query.length > 0) {
      return query.map((e) => ({ id: e.id, name: e.name }));
    }
    return [];
  }
}
