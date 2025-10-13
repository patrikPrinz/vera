import { Client, errors, estypes } from '@elastic/elasticsearch';
import ElasticPort from './elastic_port.js';

export default class ElasticAdapter implements ElasticPort {
  address: string;
  username: string;
  password: string;
  client: Client;

  constructor(address: string, username: string, password: string) {
    this.address = address;
    this.username = username;
    this.password = password;

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

  async getDbInfo(): Promise<string> {
    const info = await this.client.info();
    return info.cluster_name;
  }

  async listIndices(): Promise<Array<string>> {
    const indices = await this.client.indices.get({ index: '*' });
    console.log(indices);
    return Object.keys(indices);
  }

  async exists(index: string): Promise<boolean> {
    const exists = await this.client.indices.exists({ index: index });
    return exists ? true : false;
  }

  async index(
    index: string,
    document: unknown,
    id: string = undefined,
  ): Promise<void> {
    const request = {
      index: index,
      id: id,
      document: document,
    };
    await this.client.index(request);
  }

  async bulkIndex(index: string, documents: Array<unknown>): Promise<void> {
    if (documents.length == 0) {
      return;
    }

    const data = documents.flatMap((document) => [
      { index: { _index: index } },
      document,
    ]);
    await this.client.bulk({ body: data });
  }

  async get<T>(index: string, id: string): Promise<T | undefined> {
    try {
      const data = await this.client.get({
        index: index,
        id: id,
        _source: true,
      });
      if (!data.found) {
        return undefined;
      }
      return data._source as T;
    } catch (err: unknown) {
      if (err instanceof errors.ResponseError && err.statusCode === 404) {
        return undefined;
      }
      throw err;
    }
  }

  async search<T>(
    index: string,
    query: estypes.QueryDslQueryContainer,
  ): Promise<T[] | undefined> {
    try {
      const data = await this.client.search<T>({
        index: index,
        query: query,
        _source: true,
      });

      return data.hits.hits
        .map((hit) => hit._source)
        .filter((src): src is T => src !== undefined);
    } catch (err) {
      if (err instanceof errors.ResponseError && err.statusCode === 404) {
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
