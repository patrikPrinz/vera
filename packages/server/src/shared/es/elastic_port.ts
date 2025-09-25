export default interface ElasticPort {
  address: string;
  username?: string;
  password?: string;
  apiKey?: string;

  getDbInfo(): Promise<string>;
}
