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
    // ======= JARDINS =======
    getAllJardins() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Jardin;`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getJardin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Jardin WHERE ID = ${id.toString()};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    // ======= PARCELLES =======
    getAllParcelles() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Parcelle;`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getAllParcellesOfJardin(IDJardin) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Parcelle WHERE IDJardin = ${IDJardin.toString()};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    // ======= RANGS =======
    getAllRangs() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Rang;`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getAllRangsOfParcelle(coordsParcelle) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Rang WHERE coordonneesparcelle = ${coordsParcelle};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    // ======= VARIETES =======
    getAllVarietesInRangs() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.VarieteContenuDansUnRang;`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getAllVarietesOfSpecificRang(coordonneesRang) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.VarieteContenuDansUnRang WHERE coordonneesRang = ${coordonneesRang};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getAllVarietes() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Variete;`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getSpecificVariete(varieteName) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Variete WHERE nom = ${varieteName};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    addVariete(variete) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const sep = "##//##";
            const descriptions = variete.description.split(sep);
            if (!variete.anneemiseenmarche.toString().length || !variete.commentairegeneral.length || descriptions.length !== 3 || !variete.nom.length || !variete.periodemiseenplace.length || !variete.perioderecolte.length) {
                throw new Error("Impossible d'ajouter la variété désirée.");
            }
            const values = [
                variete.nom,
                variete.anneemiseenmarche,
                '"' + descriptions[0] + '"',
                '"' + descriptions[1] + '"',
                '"' + descriptions[2] + '"',
                variete.periodemiseenplace,
                variete.perioderecolte,
                variete.commentairegeneral,
            ];
            const queryText = `INSERT INTO jardinCommMR.Variete (nom, anneeMiseEnMarche, description, periodeMiseEnPlace, periodeRecolte, commentaireGeneral) VALUES($1, $2, ROW($3, $4, $5), $6, $7, $8);`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
    updateVariete(variete) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const sep = "##//##";
            const descriptions = variete.description.split(sep);
            if (!variete.oldvarietename || !variete.anneemiseenmarche.toString().length || !variete.commentairegeneral.length || descriptions.length !== 3 || !variete.nom.length || !variete.periodemiseenplace.length || !variete.perioderecolte.length) {
                throw new Error("Impossible de modifier la variété désirée.");
            }
            const values = [
                variete.nom,
                variete.anneemiseenmarche,
                '"' + descriptions[0] + '"',
                '"' + descriptions[1] + '"',
                '"' + descriptions[2] + '"',
                variete.periodemiseenplace,
                variete.perioderecolte,
                variete.commentairegeneral,
                variete.oldvarietename
            ];
            const queryText = `UPDATE jardinCommMR.Variete SET nom = $1, anneeMiseEnMarche = $2, description = ROW($3, $4, $5), periodeMiseEnPlace = $6, periodeRecolte = $7, commentaireGeneral = $8 WHERE nom = $9;`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
    deleteVariete(nomVariete) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            if (!nomVariete) {
                throw new Error("Impossible de supprimer la variété désirée.");
            }
            const values = [
                nomVariete
            ];
            const queryText = `DELETE FROM jardinCommMR.Variete WHERE nom = $1;`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
    // ======= PLANTES =======
    getAllPlantes() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Plante;`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getSpecificPlante(nomLatin) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Plante WHERE nomLatin = ${nomLatin};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    // ======= SEMENCIER =======
    getAllSemencier() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Semencier;`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getSpecificSemencier(nom) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Semencier WHERE nom = ${nom};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    // ======= ADAPTATIONTYPESOLVARIETE =======
    getAllAdaptationTypeSolVariete() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.AdaptationTypeSolVariete;`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getSpecificAdaptationTypeSolVariete(nomVariete) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.AdaptationTypeSolVariete WHERE nomVariete = ${nomVariete};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    addAdaptation(adaptation) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            if (!adaptation.nomvariete || !adaptation.adaptationtypesol) {
                throw new Error("Impossible d'ajouter l'adaptation désirée.");
            }
            const values = [
                adaptation.nomvariete,
                adaptation.adaptationtypesol
            ];
            const queryText = `INSERT INTO jardinCommMR.AdaptationTypeSolVariete (nomVariete, adaptationTypeSol) VALUES($1, $2);`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
    updateAdaptation(adaptation) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            if (!adaptation.adaptationtypesol) {
                return null;
            }
            if (!adaptation.nomvariete || !adaptation.oldnomvariete || adaptation.oldadaptationtypesol === undefined) {
                throw new Error("Impossible de modifier l'adaptation désirée.");
            }
            const values = [
                adaptation.nomvariete,
                adaptation.adaptationtypesol,
                adaptation.oldnomvariete,
                adaptation.oldadaptationtypesol
            ];
            const queryText = `UPDATE jardinCommMR.AdaptationTypeSolVariete SET nomVariete = $1, adaptationTypeSol = $2 WHERE nomVariete = $3 AND adaptationTypeSol = $4;`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
    // ======= PRODUCTION =======
    getAllProduction() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Production;`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    getSpecificProduction(nomVariete) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const queryText = `SELECT * FROM jardinCommMR.Production WHERE nomVariete = ${nomVariete};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    addProduction(production) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            if (!production.nomsemencier || !production.nomvariete) {
                throw new Error("Impossible d'ajouter la production désirée.");
            }
            const values = [
                production.nomvariete,
                production.nomsemencier,
                production.produitbio
            ];
            const queryText = `INSERT INTO jardinCommMR.Production (nomVariete, nomSemencier, produitBio) VALUES($1, $2, $3);`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
    updateProduction(production) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            console.table(production);
            if (!production.nomsemencier) {
                return null;
            }
            if (!production.nomvariete || production.oldnomsemencier === undefined || !production.oldnomvariete) {
                throw new Error("Impossible de modifier la production désirée.");
            }
            const values = [
                production.nomvariete,
                production.nomsemencier,
                production.produitbio,
                production.oldnomvariete,
                production.oldnomsemencier,
            ];
            const queryText = `UPDATE jardinCommMR.Production SET nomVariete = $1, nomSemencier = $2, produitBio = $3 WHERE nomVariete = $4 AND nomSemencier = $5;`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
};
DatabaseService = __decorate([
    (0, inversify_1.injectable)()
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map