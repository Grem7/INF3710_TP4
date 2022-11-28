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

  public async deleteMealplan(id: number) : Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const queryResponse = await client.query(`
      DELETE FROM public.Planrepas WHERE numeroplan = ${id}
    `);

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
