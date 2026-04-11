import type { Kysely } from 'kysely';
import { inject, injectable } from 'tsyringe';
import type { Database } from '../../../shared/postgres/schema.js';
import type { Role } from '../../auth/auth.types.js';

@injectable()
export class RolesRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  public async insertRole(role: Role): Promise<string | undefined> {
    const query = await this.adapter
      .insertInto('roles')
      .values({
        name: role.name ?? null,
        code: role.code,
        is_group_role: role.groupRole,
      })
      .returning('id')
      .executeTakeFirst();
    if (query) {
      return query.id;
    }
    return undefined;
  }

  public async deleteRole(id: string): Promise<bigint> {
    const query = await this.adapter
      .deleteFrom('roles')
      .where('id', '=', id)
      .executeTakeFirst();
    return query.numDeletedRows;
  }

  public async updateRole(role: Role): Promise<string | undefined> {
    if (role.id) {
      const query = await this.adapter
        .updateTable('roles')
        .set({
          name: role.name ?? null,
          code: role.code,
          is_group_role: role.groupRole,
        })
        .where('id', '=', role.id)
        .returning('id')
        .executeTakeFirst();
      if (query) {
        return query.id;
      }
      return undefined;
    }
    throw new ReferenceError('Id not specified in Role object');
  }

  public async listRoles(): Promise<Role[]> {
    const query = await this.adapter
      .selectFrom('roles')
      .select(['id', 'name', 'code', 'is_group_role'])
      .execute();

    if (query) {
      const roles = query.map((e) => ({
        id: e.id,
        name: e.name,
        code: e.code,
        groupRole: e.is_group_role,
      })) as Role[];

      return roles;
    }
    return [];
  }

  public async assignRole(
    userId: string,
    roleId: string,
    groupId?: string,
  ): Promise<string | undefined> {
    const query = await this.adapter
      .insertInto('user_roles')
      .values({
        user_id: userId,
        role_id: roleId,
        group_id: groupId ?? null,
      })
      .returning('id')
      .executeTakeFirst();
    if (query) {
      return query.id;
    }
    return undefined;
  }

  public async unassignRole(
    userId: string,
    roleId: string,
    groupId?: string,
  ): Promise<bigint> {
    let query = this.adapter
      .deleteFrom('user_roles')
      .where('user_id', '=', userId)
      .where('role_id', '=', roleId);

    query = groupId
      ? query.where('group_id', '=', groupId)
      : query.where('group_id', 'is', null);
    const result = await query.executeTakeFirst();
    return result.numDeletedRows;
  }

  public async hasRole(
    userId: string,
    role: string[],
    groupId: string = '0',
  ): Promise<boolean> {
    const query = await this.adapter
      .selectFrom('user_roles')
      .innerJoin('roles', 'user_roles.role_id', 'roles.id')
      .select('user_roles.id')
      .where('user_roles.user_id', '=', userId)
      .where('roles.code', 'in', role)
      .where((eb) =>
        eb.or([eb('group_id', '=', groupId), eb('group_id', 'is', null)]),
      )
      .execute();

    if (query.length > 0) {
      return true;
    }
    return false;
  }

  public async listUserRoles(userId: string): Promise<Role[]> {
    const query = await this.adapter
      .selectFrom('user_roles')
      .innerJoin('roles', 'user_roles.role_id', 'roles.id')
      .select(['roles.code', 'roles.id', 'roles.name', 'roles.is_group_role'])
      .where('user_id', '=', userId)
      .execute();

    if (query.length > 0) {
      return query.map((e) => ({
        id: e.id,
        code: e.code,
        name: e.name,
        groupRole: e.is_group_role,
      }));

      return [];
    }
  }
}
