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

      this.databaseService.deleteMealplan(id)
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
        const provider: ProviderInfo[] = result.rows.map(element => ({
          id: element.numerofournisseur,
          name: element.nomfournisseur,
          address: element.adressefournisseur
        } as ProviderInfo));
        res.json(provider);
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
    });

    router.put('/mealplans', async (req, res) => {
      const mealplan = req.body;

      this.databaseService.updateInTable(
        'Planrepas',
        ['numeroplan', mealplan.id],
        ['categorie', mealplan.category],
        ['frequence', mealplan.frequency],
        ['nbpersonnes', mealplan.nbPeople],
        ['nbcalories', mealplan.calories],
        ['prix', mealplan.price],
        ['numerofournisseur', mealplan.provider?.id]
    )
    .then(result => {
      switch(mealplan.category) {
        case 'Famille':
          
        case 'Vegetarien':

        case 'Pescetarien':

      }
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
