import {
  getGroupsResponseSchema,
  groupResponseSchema,
} from '@/modules/admin/services/adminService.schema';
import { HttpError } from '@/shared/httpClient/http.errors';
import type { Group } from '@/shared/types/auth/auth.types';
import type { Axios } from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export class GroupsService {
  protected client: Axios;

  constructor(client: Axios) {
    this.client = client;
  }

  public async listUserGroups(userId: string): Promise<Group[]> {
    const response = await this.client.get(`/admin/user-groups/${userId}`);
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

  public async getGroup(groupId: string): Promise<Group | undefined> {
    const response = await this.client.get(`/admin/group/${groupId}`);
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return undefined;
    }
    if (response.data == undefined) {
      return undefined;
    }
    const validatedData = groupResponseSchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data as Group;
    }
    throw new HttpError();
  }
}
