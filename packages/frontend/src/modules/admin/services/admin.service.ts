import type { Axios } from 'axios';
import {
  getUsersResponseSchema,
  getGroupsResponseSchema,
  createGroupResponseSchema,
  getRolesResponseSchema,
} from './adminService.schema';
import { HttpError } from '@/shared/httpClient/http.errors';
import type { Group, Role, UserDetails } from '@/shared/types/auth/auth.types';
import { useToast } from 'vue-toastification';

const toast = useToast();

export class AdminService {
  protected client: Axios;
  constructor(client: Axios) {
    this.client = client;
  }

  public async listUsers(): Promise<UserDetails[]> {
    const response = await this.client.get('admin/users');
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return [];
    }
    const validatedData = getUsersResponseSchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data as UserDetails[];
    }
    throw new HttpError();
  }

  public async listGroups(): Promise<Group[]> {
    const response = await this.client.get('admin/groups');
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return [];
    }
    const validatedData = getGroupsResponseSchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data as Group[];
    }
    throw new HttpError();
  }

  public async createGroup(group: Group): Promise<Group | undefined> {
    const response = await this.client.post('admin/groups', { group: group });
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return undefined;
    }
    const validatedData = createGroupResponseSchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data as Group;
    }
    throw new HttpError();
  }

  public async addUserToGroup(
    groupId: string,
    userId: string,
  ): Promise<string | undefined> {
    const response = await this.client.post('admin/groups/assign', {
      userId: userId,
      groupId: groupId,
    });
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return undefined;
    }
    return response.data as string;
  }

  public async removeUserFromGroup(
    groupId: string,
    userId: string,
  ): Promise<boolean> {
    const response = await this.client.post('admin/groups/unassign', {
      userId: userId,
      groupId: groupId,
    });
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return false;
    }
    return (response.data as number) > 0;
  }

  public async listGroupUsers(groupId: string): Promise<UserDetails[]> {
    const response = await this.client.get(`admin/group/${groupId}/users`);
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return [];
    }
    const validatedData = getUsersResponseSchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data as UserDetails[];
    }
    throw new HttpError();
  }

  public async listRoles() {
    const rolesResponse = await this.client.get('admin/roles');
    if (rolesResponse.status == 401 || rolesResponse.status == 403) {
      toast.error('Log in as admin to view this section.');
      return [];
    }
    const validatedData = getRolesResponseSchema.safeParse(rolesResponse.data);
    if (validatedData.success) {
      return validatedData.data as Role[];
    }
    throw new HttpError();
  }

  public async assignRole(
    roleId: string,
    userId: string,
  ): Promise<string | undefined> {
    const response = await this.client.post('admin/roles/assign', {
      userRole: {
        userId: userId,
        roleId: roleId,
      },
    });
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return undefined;
    }
    return response.data as string;
  }

  public async unassignRole(roleId: string, userId: string): Promise<boolean> {
    const response = await this.client.post('admin/roles/unassign', {
      userRole: {
        userId: userId,
        roleId: roleId,
      },
    });
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return false;
    }
    return (response.data as number) > 0;
  }
}
