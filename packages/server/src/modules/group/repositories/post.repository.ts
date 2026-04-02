import type { Kysely } from 'kysely';
import { injectable, inject } from 'tsyringe';
import type { Database } from '../../../shared/postgres/schema.js';
import type { GroupPost } from '../../../shared/types/group/group.types.js';

@injectable()
export class PostRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  public async listGroupPosts(groupId: string): Promise<GroupPost[]> {
    const postsQuery = await this.adapter
      .selectFrom('group_content')
      .select(['id', 'author_id', 'group_id', 'title', 'content', 'created_at'])
      .where('group_id', '=', groupId)
      .orderBy('id')
      .execute();
    if (postsQuery.length > 0) {
      return postsQuery.map(
        (e) =>
          ({
            id: e.id,
            groupId: e.group_id,
            authorId: e.author_id,
            title: e.title,
            content: e.content,
            createdAt: e.created_at,
          }) as GroupPost,
      );
    }
    return [];
  }

  public async findPostById(id: string): Promise<GroupPost | undefined> {
    const query = await this.adapter
      .selectFrom('group_content')
      .select(['id', 'author_id', 'group_id', 'title', 'content', 'created_at'])
      .where('id', '=', id)
      .executeTakeFirst();
    if (query) {
      return {
        id: query.id,
        authorId: query.author_id,
        groupId: query.group_id,
        title: query.title,
        content: query.content,
        createdAt: query.created_at,
      } as GroupPost;
    }
    return undefined;
  }

  /**
   * Creates a new post in group.
   *
   * @param post object with new post data
   * @returns `id` of newly created post, undefined, if not created
   */
  public async insertPost(post: GroupPost): Promise<string | undefined> {
    const insertedPost = await this.adapter
      .insertInto('group_content')
      .values({
        group_id: post.groupId,
        author_id: post.authorId,
        title: post.title,
        content: post.content,
      })
      .returning('id')
      .executeTakeFirst();
    if (insertedPost) {
      return insertedPost.id;
    }
    return undefined;
  }

  public async archivePost(id: string): Promise<boolean> {
    const query = await this.adapter
      .updateTable('group_content')
      .set({ archived: true })
      .where('id', '=', id)
      .executeTakeFirst();
    if (query.numUpdatedRows > 0) {
      return true;
    }
    return false;
  }
}
