
import { Pool } from 'pg';
import { DB_CONFIG } from './aws-config';

class DatabaseClient {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(DB_CONFIG);
  }

  async query(text: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async end() {
    await this.pool.end();
  }
}

export const db = new DatabaseClient();
