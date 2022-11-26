import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";

@injectable()
export class DatabaseService {
  public connectionConfig: pg.ConnectionConfig = {
    user: "postgres",
    database: "TP4",
    password: "root",
    port: 5432,          // Attention ! Peut aussi être 5433 pour certains utilisateurs
    host: "127.0.0.1",
    keepAlive: true
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);

  public async getAllFromTable(tableName: string): Promise<pg.QueryResult> {
      const client = await this.pool.connect();

      const queryResponse = await client.query(`SELECT * FROM public.${tableName}`);

      client.release();

      return queryResponse;
  }

  public async getColumnsFromTable(tableName: string, ...columns: string[]): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const queryResponse = await client.query(`SELECT ${columns.join()} FROM public.${tableName}`);
    
    client.release();

    return queryResponse;
  }

  public async addToTable(tableName: string, ...values: any[]) : Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const queryResponse = await client.query(`INSERT INTO ${tableName} VALUES (${values.join()}) RETURNING *`);

    client.release();

    return queryResponse;
  }
}
