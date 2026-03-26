import { injectable, inject } from 'tsyringe';
import type { PostRepository } from '../repositories/post.repository.js';
import type { User } from '../../auth/auth.types.js';
import type { GroupPost } from '../../../shared/types/group/group.types.js';
import type { RolesService } from '../../auth/services/roles.service.js';
import { GroupsService } from '../../auth/services/groups.service.js';
import {
  AppError,
  NotFoundError,
  PermissionError,
} from '../../../shared/error_handler/errors.js';

@injectable()
export class PostService {
  protected postRepository: PostRepository;
  protected rolesService: RolesService;
  protected groupsService: GroupsService;

  constructor(
    @inject('PostRepository') postRepository: PostRepository,
    @inject('RolesService') rolesService: RolesService,
    @inject('GroupsService') groupsService: GroupsService,
  ) {
    this.postRepository = postRepository;
    this.rolesService = rolesService;
    this.groupsService = groupsService;
  }

  public async listPosts(author: User, groupId: string): Promise<GroupPost[]> {
    if (
      (await this.groupsService.isInGroup(author, author.id, groupId)) ||
      (await this.rolesService.hasRole(author))
    ) {
      const result = await this.postRepository.listGroupPosts(groupId);
      if (result.length > 0) {
        return result;
      }
      return [];
    }
    throw new PermissionError(
      'User not permitted to view posts of this group.',
    );
  }

  public async findPost(author: User, postId: string): Promise<GroupPost> {
    const groupPost = await this.postRepository.findPostById(postId);
    if (!groupPost) {
      throw new NotFoundError('Post not found.');
    }
    if (
      (await this.groupsService.isInGroup(
        author,
        author.id,
        groupPost.groupId,
      )) ||
      (await this.rolesService.hasRole(author))
    ) {
      return groupPost;
    }
    throw new PermissionError(
      'User not permitted to view posts of this group.',
    );
  }

  public async createPost(author: User, post: GroupPost): Promise<GroupPost> {
    if (
      await this.rolesService.hasRole(
        author,
        ['group_admin', 'group_content_admin'],
        post.groupId,
      )
    ) {
      const insertionId = await this.postRepository.insertPost(post);
      if (insertionId) {
        post.id = insertionId;
        return post;
      }
      throw new AppError();
    }
    throw new PermissionError(
      'User not permitted to create post in this group.',
    );
  }

  public async archivePost(author: User, postId: string) {
    if (
      await this.rolesService.hasRole(
        author,
        ['group_admin', 'group_content_admin'],
        postId,
      )
    ) {
      const postDeletion = await this.postRepository.archivePost(postId);
      if (postDeletion) {
        return true;
      }
      throw new NotFoundError('Post not found.');
    }
    throw new PermissionError(
      'User not permitted to archive posts in this group.',
    );
  }
}
