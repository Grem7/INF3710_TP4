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

  public async addRowToTable(tableName: string, ...values: any[]) : Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const format : string[] = [];
    for (let i = 0; i < values.length; i++) format.push(`$${i+1}`);

    const queryResponse = await client.query(`INSERT INTO public.${tableName} VALUES (${format.join()})`, values);

    client.release();

    return queryResponse;
  }

  public async updateInTable(tableName: string, condition: any, data: any) : Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    
    const conditions: string[] = [];
    const sets: string[] = [];
    const values: any[] = [];
    

    let valueIndex: number = 1;
    for (const key in data) {
      sets.push(`${key} = $${valueIndex++}`);
      values.push(data[key]);
    }

    for (const key in condition) {
      conditions.push(`${key} = $${valueIndex++}`);
      values.push(condition[key]);
    }

    console.log(`
    UPDATE public.${tableName}
    SET ${sets.join()}
    WHERE ${conditions.join()}`);
    console.log(values);

    const queryResponse = client.query(`
    UPDATE public.${tableName}
    SET ${sets.join()}
    WHERE ${conditions.join()}`,
    values);

    client.release();

    return queryResponse;
  }

  public async deleteRowFromTable(tableName: string, condition: any) : Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const conditions: string[] = [];
    const values: any[] = [];

    let valueIndex = 1;
    for (const key in condition) {
      conditions.push(`${key} = $${valueIndex}`);
      values.push(condition[key]);
    }

    const queryResponse = await client.query(`
      DELETE FROM public.${tableName} WHERE ${conditions.join()}
    `, values);

    client.release();

    return queryResponse;
  }

  public async getMealplans() : Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const queryResponse = await client.query(`
      SELECT *
      FROM public.Planrepas Plan
      NATURAL LEFT JOIN public.Vegetarien
      NATURAL LEFT JOIN public.Pescetarien
      NATURAL LEFT JOIN public.Famille
      NATURAL LEFT JOIN public.Rapide
      NATURAL LEFT JOIN public.Facile
      NATURAL LEFT JOIN public.Fournisseur
      ORDER BY Plan.numeroplan
    `);

    client.release();

    return queryResponse;
  }
}
