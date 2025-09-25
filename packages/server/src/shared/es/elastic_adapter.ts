import { Client } from '@elastic/elasticsearch';
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
}
