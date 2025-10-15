export default interface ElasticPort {
  address: string;
  username?: string;
  password?: string;
  apiKey?: string;

  getDbInfo(): Promise<string>;
  listIndices(): Promise<Array<string>>;
  exists(index: string): Promise<boolean>;
  index(index: string, document: unknown, id: string): Promise<void>;
  get(index: string, id: string): Promise<unknown>;
  delete(index: string, id: string): Promise<void>;
  search(index: string, query: unknown);
}
