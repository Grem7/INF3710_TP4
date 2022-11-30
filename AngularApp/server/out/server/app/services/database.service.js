"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const inversify_1 = require("inversify");
const pg = require("pg");
require("reflect-metadata");
let DatabaseService = class DatabaseService {
    constructor() {
        this.connectionConfig = {
            user: "postgres",
            database: "TP4",
            password: "root",
            port: 5432,
            host: "127.0.0.1",
            keepAlive: true
        };
        this.pool = new pg.Pool(this.connectionConfig);
    }
    getAllFromTable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryResponse = yield client.query(`SELECT * FROM public.${tableName}`);
            client.release();
            return queryResponse;
        });
    }
    getColumnsFromTable(tableName, ...columns) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryResponse = yield client.query(`SELECT ${columns.join()} FROM public.${tableName}`);
            client.release();
            return queryResponse;
        });
    }
    addRowToTable(tableName, ...values) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const format = [];
            for (let i = 0; i < values.length; i++)
                format.push(`$${i + 1}`);
            const queryResponse = yield client.query(`INSERT INTO public.${tableName} VALUES (${format.join()})`, values);
            client.release();
            return queryResponse;
        });
    }
    updateInTable(tableName, condition, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const conditions = [];
            const sets = [];
            const values = [];
            let valueIndex = 1;
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
    WHERE ${conditions.join()}`, values);
            client.release();
            return queryResponse;
        });
    }
    deleteRowFromTable(tableName, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const conditions = [];
            const values = [];
            let valueIndex = 1;
            for (const key in condition) {
                conditions.push(`${key} = $${valueIndex}`);
                values.push(condition[key]);
            }
            const queryResponse = yield client.query(`
      DELETE FROM public.${tableName} WHERE ${conditions.join()}
    `, values);
            client.release();
            return queryResponse;
        });
    }
    getMealplans() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryResponse = yield client.query(`
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
        });
    }
};
DatabaseService = __decorate([
    (0, inversify_1.injectable)()
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map