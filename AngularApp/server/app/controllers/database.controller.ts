import { Router } from "express";
import { inject, injectable } from "inversify";
import { DatabaseService } from "../services/database.service";
import { ProviderInfo } from "../../../common/tables/provider-info"
import { MealPlanInfo } from "../../../common/tables/mealplan-info";
import Types from "../types";

@injectable()
export class DatabaseController {
  public constructor(
    // @ts-ignore -- À ENLEVER LORSQUE L'IMPLÉMENTATION EST TERMINÉE
    @inject(Types.DatabaseService) private readonly databaseService: DatabaseService
  ) {}

  public get router(): Router {
    const router: Router = Router();

    router.use(async (req, res, next) => {
      console.log(`request made on ${req.url}`);
      next();
    });

    router.delete('/mealplans/:id', async (req, res) => {
      const id: number = Number(req.params.id);
      console.log(`Attempting to delete mealplan numbered ${id}`);

      this.databaseService.deleteRowFromTable('Planrepas', { numeroplan: id })
      .then(result => {
        res.json(result.rowCount);
      })
      .catch(e => {
        console.error(e.stack);
        res.json(-1);
      });
    });
    
    router.get('/providers', async (req, res) => {
      this.databaseService.getAllFromTable('Fournisseur').then(result => {
        const providers: ProviderInfo[] = result.rows.map(element => ({
          id: element.numerofournisseur,
          name: element.nomfournisseur,
          address: element.adressefournisseur
        } as ProviderInfo));
        console.log(providers);
        res.json(providers);
      })
      .catch(e => {
        console.log(e.stack);
      })
    });

    router.get('/mealplans', async (req, res) => {
      this.databaseService.getMealplans().then(result => {
        const mealplans: MealPlanInfo[] = result.rows.map(element => ({
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
        } as MealPlanInfo));
        res.json(mealplans);
      })
      .catch(e => {
        console.log(e.stack);
      })
    });

    router.put('/mealplans/:id', async (req, res) => {
      const id: number = Number(req.params.id);
      const delta: any = req.body;

      let values: any = {};

      if (delta.id) values.numeroplan = delta.id.newValue;
      if (delta.category) values.categorie = delta.category.newValue;
      if (delta.frequency) values.frequence = delta.frequency.newValue;
      if (delta.nbPeople) values.nbpersonnes = delta.nbPeople.newValue;
      if (delta.calories) values.nbcalories = delta.calories.newValue;
      if (delta.price) values.prix = delta.price.newValue.newValue;
      if (delta.provider) values.numerofournisseur = delta.provider.newValue.id;

      this.databaseService.updateInTable('Planrepas', {numeroplan: id}, values)
      .then(async result => {
        // if the category was changed, we need to delete the row in the last category's table...
        const finalId = delta.id ? delta.id.newValue : id;
        console.log("New id:"+finalId);
        if (delta.category) {
          await this.databaseService.deleteRowFromTable(delta.category.oldValue, { numeroplan: finalId });

          switch (delta.category.newValue) {
            case 'Vegetarien':
              await this.databaseService.addRowToTable('Vegetarien', finalId, delta.mealType?.newValue);
              break;

            case 'Pescetarien':
              await this.databaseService.addRowToTable('Pescetarien', finalId, delta.fishBreed?.newValue);
              break;

            case 'Famille':
              await this.databaseService.addRowToTable('Famille', finalId);
              if (delta.prepTime) await this.databaseService.addRowToTable('Rapide', finalId, delta.prepTime.newValue).catch(e => {console.log(e.stack); res.json(-1)});
              if (delta.nbIngredients) await this.databaseService.addRowToTable('Facile', finalId, delta.nbIngredients.newValue).catch(e => {console.log(e.stack); res.json(-1)});
          }
        }
        else {
          if (delta.prepTime) await this.databaseService.updateInTable('Rapide', {numeroplan: finalId}, {tempsdepreparation: delta.prepTime.newValue}).catch(e => {console.log(e.stack); res.json(-1)});
          if (delta.nbIngredients) await this.databaseService.updateInTable('Facile', {numeroplan: finalId}, {nbingredients: delta.nbIngredients.newValue}).catch(e => {console.log(e.stack); res.json(-1)});
          if (delta.mealType) await this.databaseService.updateInTable('Vegetarien', {numeroplan: finalId}, {typederepas: delta.mealType.newValue}).catch(e => {console.log(e.stack); res.json(-1)});
          if (delta.fishBreed) await this.databaseService.updateInTable('Pescetarien', {numeroplan: finalId}, {typederepas: delta.fishBreed.newValue}).catch(e => {console.log(e.stack); res.json(-1)});
        }
        res.json(result.rowCount);
      })
      .catch(e => {
        console.log(e.stack);
        res.json(-1);
      })
    });

    router.post('/mealplans', async (req, res) => {
      const mealplan = req.body;

      this.databaseService.addRowToTable(
        'Planrepas',
        mealplan.id,
        mealplan.category,
        mealplan.frequency,
        mealplan.nbPeople,
        mealplan.calories,
        mealplan.price,
        mealplan.provider ? mealplan.provider.id : -1
        )
      .then(result => {
        if (mealplan.mealType) this.databaseService.addRowToTable('Vegetarien', mealplan.id, mealplan.mealType);
        if (mealplan.fishBreed) this.databaseService.addRowToTable('Pescetarien', mealplan.id, mealplan.fishBreed);
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
      })
    });
    
    return router;
  }
}
