import { Client, estypes } from '@elastic/elasticsearch';

/**
 * Iterface for Elasticsearch adapter
 *
 * Creates abstraction layer on top of elasticsearch library and implements
 * basic methods to be used in domain-specific classes
 */
export default interface ElasticPort {
  /** Elasticsearch client can be used for interacting with elastic directly */
  client: Client;

  /**
   * Lists currently existing indices in database
   *
   * @returns Array of indices present in database
   */
  listIndices(): Promise<string[]>;

  /**
   * Checks if specified index exists
   *
   * @param index Name of an index
   * @returns True, if index with given name exists, false in other case
   */
  exists(index: string): Promise<boolean>;

  /**
   * Inserts provided document into index
   *
   * @param index Name of used index
   * @param document Object representing document to be created
   * @param id *(optional)* Identificator of document in database
   */
  index(index: string, document: unknown, id?: string): Promise<void>;

  /**
   * Inserts all provided documents into an index
   *
   * @param index Name of used index
   * @param documents Array of documents to be inserted
   */
  bulkIndex(index: string, documents: Array<unknown>): Promise<void>;

  /**
   * Find document by its id
   *
   * @param index Name of used index
   * @param id Id to search by
   * @returns Object representing the record if found, undefined else
   */
  get(index: string, id: string): Promise<unknown>;

  /**
   * Delete document with the specified id
   *
   * @param index Name of used index
   * @param id Id of index to delete
   */
  delete(index: string, id: string): Promise<void>;

  /**
   * Search documents by query
   *
   * @param index Name of index
   * @param query Elastic-specific container with query
   * @returns Array of found documents
   */
  search(
    index: string,
    query: estypes.QueryDslQueryContainer,
  ): Promise<estypes.SearchHit[]>;

  /**
   * Wrapper for aggregation query
   *
   * @param index Name of index used
   * @param aggregation Elastic-specific aggregation container
   * @param query Elastic-specific container with query
   * @returns Aggregation object for provided aggregation
   */
  aggregate(
    index: string,
    aggregation: estypes.AggregationsAggregationContainer,
    query: estypes.QueryDslQueryContainer,
  ): Promise<estypes.AggregationsAggregate | undefined>;
}
