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
      .selectFrom('group_posts')
      .select(['id', 'group_id', 'title', 'content'])
      .where('group_id', '=', groupId)
      .orderBy('id')
      .execute();
    if (postsQuery.length > 0) {
      return postsQuery.map(
        (e) =>
          ({
            id: e.id,
            groupId: e.group_id,
            title: e.title,
            content: e.content,
          }) as GroupPost,
      );
    }
    return [];
  }

  /**
   * Creates a new post in group.
   *
   * @param post object with new post data
   * @returns `id` of newly created post, undefined, if not created
   */
  public async insertPost(post: GroupPost): Promise<string | undefined> {
    const insertedPost = await this.adapter
      .insertInto('group_posts')
      .values({
        group_id: post.groupId,
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
}
