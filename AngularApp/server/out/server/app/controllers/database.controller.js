"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.DatabaseController = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const database_service_1 = require("../services/database.service");
const types_1 = require("../types");
let DatabaseController = class DatabaseController {
    constructor(
    // @ts-ignore -- À ENLEVER LORSQUE L'IMPLÉMENTATION EST TERMINÉE
    databaseService) {
        this.databaseService = databaseService;
    }
    get router() {
        const router = (0, express_1.Router)();
        router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log(`request made on ${req.url}`);
            next();
        }));
        router.delete('/mealplans/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            console.log(`Attempting to delete mealplan numbered ${id}`);
            this.databaseService.deleteRowFromTable('Planrepas', { numeroplan: id })
                .then(result => {
                res.json(result.rowCount);
            })
                .catch(e => {
                console.error(e.stack);
                res.json(-1);
            });
        }));
        router.get('/providers', (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.databaseService.getAllFromTable('Fournisseur').then(result => {
                const providers = result.rows.map(element => ({
                    id: element.numerofournisseur,
                    name: element.nomfournisseur,
                    address: element.adressefournisseur
                }));
                console.log(providers);
                res.json(providers);
            })
                .catch(e => {
                console.log(e.stack);
            });
        }));
        router.get('/mealplans', (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.databaseService.getMealplans().then(result => {
                const mealplans = result.rows.map(element => ({
                    id: element.numeroplan,
                    category: element.categorie,
                    frequency: element.frequence,
                    nbPeople: element.nbpersonnes,
                    calories: element.nbcalories,
                    price: element.prix,
                    provider: {
                        id: element.numerofournisseur,
                        name: element.nomfournisseur,
                        address: element.adressefournisseur
                    },
                    fishBreed: element.typepoisson,
                    mealType: element.typederepas,
                    prepTime: element.tempsdepreparation,
                    nbIngredients: element.nbingredients
                }));
                res.json(mealplans);
            })
                .catch(e => {
                console.log(e.stack);
            });
        }));
        router.put('/mealplans/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const delta = req.body;
            let values = {};
            if (delta.id)
                values.numeroplan = delta.id.newValue;
            if (delta.category)
                values.categorie = delta.category.newValue;
            if (delta.frequency)
                values.frequence = delta.frequency.newValue;
            if (delta.nbPeople)
                values.nbpersonnes = delta.nbPeople.newValue;
            if (delta.calories)
                values.nbcalories = delta.calories.newValue;
            if (delta.price)
                values.prix = delta.price.newValue.newValue;
            if (delta.provider)
                values.numerofournisseur = delta.provider.newValue.id;
            this.databaseService.updateInTable('Planrepas', { numeroplan: id }, values)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                // if the category was changed, we need to delete the row in the last category's table...
                const finalId = delta.id ? delta.id.newValue : id;
                console.log("New id:" + finalId);
                if (delta.category) {
                    yield this.databaseService.deleteRowFromTable(delta.category.oldValue, { numeroplan: finalId });
                    switch (delta.category.newValue) {
                        case 'Vegetarien':
                            yield this.databaseService.addRowToTable('Vegetarien', finalId, (_a = delta.mealType) === null || _a === void 0 ? void 0 : _a.newValue);
                            break;
                        case 'Pescetarien':
                            yield this.databaseService.addRowToTable('Pescetarien', finalId, (_b = delta.fishBreed) === null || _b === void 0 ? void 0 : _b.newValue);
                            break;
                        case 'Famille':
                            yield this.databaseService.addRowToTable('Famille', finalId);
                            if (delta.prepTime)
                                yield this.databaseService.addRowToTable('Rapide', finalId, delta.prepTime.newValue).catch(e => { console.log(e.stack); res.json(-1); });
                            if (delta.nbIngredients)
                                yield this.databaseService.addRowToTable('Facile', finalId, delta.nbIngredients.newValue).catch(e => { console.log(e.stack); res.json(-1); });
                    }
                }
                else {
                    if (delta.prepTime)
                        yield this.databaseService.updateInTable('Rapide', { numeroplan: finalId }, { tempsdepreparation: delta.prepTime.newValue }).catch(e => { console.log(e.stack); res.json(-1); });
                    if (delta.nbIngredients)
                        yield this.databaseService.updateInTable('Facile', { numeroplan: finalId }, { nbingredients: delta.nbIngredients.newValue }).catch(e => { console.log(e.stack); res.json(-1); });
                    if (delta.mealType)
                        yield this.databaseService.updateInTable('Vegetarien', { numeroplan: finalId }, { typederepas: delta.mealType.newValue }).catch(e => { console.log(e.stack); res.json(-1); });
                    if (delta.fishBreed)
                        yield this.databaseService.updateInTable('Pescetarien', { numeroplan: finalId }, { typederepas: delta.fishBreed.newValue }).catch(e => { console.log(e.stack); res.json(-1); });
                }
                res.json(result.rowCount);
            }))
                .catch(e => {
                console.log(e.stack);
                res.json(-1);
            });
        }));
        router.post('/mealplans', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const mealplan = req.body;
            this.databaseService.addRowToTable('Planrepas', mealplan.id, mealplan.category, mealplan.frequency, mealplan.nbPeople, mealplan.calories, mealplan.price, mealplan.provider ? mealplan.provider.id : -1)
                .then(result => {
                if (mealplan.mealType)
                    this.databaseService.addRowToTable('Vegetarien', mealplan.id, mealplan.mealType);
                if (mealplan.fishBreed)
                    this.databaseService.addRowToTable('Pescetarien', mealplan.id, mealplan.fishBreed);
                if (mealplan.prepTime) {
                    this.databaseService.addRowToTable('Famille', mealplan.id);
                    this.databaseService.addRowToTable('Rapide', mealplan.id, mealplan.prepTime);
                }
                if (mealplan.nbIngredients) {
                    this.databaseService.addRowToTable('Famille', mealplan.id);
                    this.databaseService.addRowToTable('Facile', mealplan.id, mealplan.nbIngredients);
                }
                res.json(result.rowCount);
            })
                .catch(e => {
                console.error(e.stack);
                res.json(-1);
            });
        }));
        return router;
    }
};
DatabaseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DatabaseService)),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DatabaseController);
exports.DatabaseController = DatabaseController;
//# sourceMappingURL=database.controller.js.map