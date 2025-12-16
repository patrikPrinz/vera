import { injectable } from 'tsyringe';
import { Client, errors } from '@elastic/elasticsearch';
import type { estypes } from '@elastic/elasticsearch';

import type ElasticPort from './elastic_port.js';

/**
 * Basic Elasticsearch connection class.
 *
 * Implements basic methods for database connection to be used in module-specific
 * repository classes
 */
@injectable()
export class ElasticAdapter implements ElasticPort {
  public client: Client;

  constructor(address: string, username: string, password: string) {
    if (password && username) {
      this.client = new Client({
        node: address,
        auth: {
          username: username,
          password: password,
        },
      });
    }
  }

  /**
   * Basic method used to check if connection was established successfully
   *
   * @returns Name of connected elasticsearch cluster
   * @public
   */
  public async getDbInfo(): Promise<string> {
    const info = await this.client.info();
    return info.cluster_name;
  }

  public async listIndices(): Promise<Array<string>> {
    const indices = await this.client.indices.get({ index: '*' });
    return Object.keys(indices);
  }

  public async exists(index: string): Promise<boolean> {
    const exists = await this.client.indices.exists({ index: index });
    return exists ? true : false;
  }

  public async index(
    index: string,
    document: unknown,
    id?: string,
  ): Promise<void> {
    try {
      const request = {
        index: index,
        id: id,
        document: document,
      };
      await this.client.index(request);
    } catch (err) {
      if (err instanceof errors.ResponseError && err.statusCode === 404) {
        return undefined;
      }
      throw err;
    }
  }

  public async bulkIndex(
    index: string,
    documents: Array<unknown>,
  ): Promise<void> {
    if (documents.length == 0) {
      return;
    }

    const data = documents.flatMap((document) => [
      { index: { _index: index } },
      document,
    ]);
    await this.client.bulk({ body: data });
  }

  public async get(index: string, id: string): Promise<unknown> {
    try {
      const data = await this.client.get({
        index: index,
        id: id,
        _source: true,
      });
      if (!data.found) {
        return undefined;
      }
      return data._source;
    } catch (err: unknown) {
      if (err instanceof errors.ResponseError && err.statusCode === 404) {
        return undefined;
      }
      throw err;
    }
  }

  public async search(
    index: string,
    query: estypes.QueryDslQueryContainer,
  ): Promise<estypes.SearchHit[]> {
    try {
      const data = await this.client.search({
        index: index,
        query: query,
        _source: true,
      });

      return data.hits.hits;
    } catch (err) {
      if (err instanceof errors.ResponseError && err.statusCode === 404) {
        console.log('nic tu není');
        return undefined;
      }
      throw err;
    }
  }

  async aggregate(
    index: string,
    aggregation: estypes.AggregationsAggregationContainer,
    query: estypes.QueryDslQueryContainer = undefined,
  ): Promise<estypes.AggregationsAggregate | undefined> {
    try {
      const data = await this.client.search({
        index: index,
        query: query,
        aggs: {
          myAgg: aggregation,
        },
        _source: true,
      });

      return data.aggregations?.myAgg;
    } catch (err) {
      if (err instanceof errors.ResponseError && err.statusCode === 404) {
        return undefined;
      }
      throw err;
    }
  }

  async delete(index: string, id: string): Promise<void> {
    await this.client.delete({ index: index, id: id });
  }
}
