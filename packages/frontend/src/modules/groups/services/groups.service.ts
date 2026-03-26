import {
  getGroupsResponseSchema,
  groupResponseSchema,
} from '@/modules/admin/services/adminService.schema';
import { HttpError } from '@/shared/httpClient/http.errors';
import type { Group } from '@/shared/types/auth/auth.types';
import type { GroupPost } from '@/shared/types/group/group.types';
import type { Axios } from 'axios';
import { useToast } from 'vue-toastification';
import { groupPostArraySchema, groupPostSchema } from './groupsServvice.schema';

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

  public async getGroupPosts(groupId: string): Promise<GroupPost[]> {
    const response = await this.client.get(`/group/${groupId}/posts`);
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return [];
    }
    const validatedData = groupPostArraySchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data as GroupPost[];
    }
    throw new HttpError();
  }

  public async getGroupPost(postId: string): Promise<GroupPost | undefined> {
    const response = await this.client.get(`/group/post/${postId}`);
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      return undefined;
    }
    if (response.data == undefined) {
      return undefined;
    }
    const validatedData = groupPostSchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data as GroupPost;
    }
    throw new HttpError();
  }

  public async createPost(post: GroupPost): Promise<GroupPost> {
    const response = await this.client.post('group/post', {
      post: {
        groupId: post.groupId,
        authorId: post.authorId,
        title: post.title,
        content: post.content,
      },
    });
    if (response.status == 401 || response.status == 403) {
      toast.error('Log in as admin to view this section.');
      throw new HttpError();
    }
    if (response.data == undefined) {
      throw new HttpError();
    }
    const validatedData = groupPostSchema.safeParse(response.data);
    if (validatedData.success) {
      return validatedData.data as GroupPost;
    }
    throw new HttpError();
  }
}
