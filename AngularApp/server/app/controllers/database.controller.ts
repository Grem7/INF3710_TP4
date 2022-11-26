import { Router } from "express";
import { inject, injectable } from "inversify";
import { DatabaseService } from "../services/database.service";
import { ProviderInfo } from "../../../common/tables/provider-info"
import Types from "../types";
import { QueryResult } from "pg";

@injectable()
export class DatabaseController {
  public constructor(
    // @ts-ignore -- À ENLEVER LORSQUE L'IMPLÉMENTATION EST TERMINÉE
    @inject(Types.DatabaseService) private readonly databaseService: DatabaseService
  ) {}

  public get router(): Router {
    const router: Router = Router();

    router.get('/providers', async (req, res) => {
      const queryResponse = await this.databaseService.getAllFromTable('Fournisseur');

      const providers: ProviderInfo[] = [];

      for (let i = 0; i < queryResponse.rowCount; i++) {
        providers.push({
          id: queryResponse.rows[i][0],
          name: queryResponse.rows[i][1],
          address: queryResponse.rows[i][2]
        })
      }

      res.json(providers);
    });

    router.post('/mealPlan', async (req, res) => {
      const plan = req.body;
      
      const queryResult: QueryResult = await this.databaseService.addToTable(
        'Planrepas',
        plan.category,
        plan.frequency,
        plan.nbPeople,
        plan.calories,
        plan.price,
        plan.providerId
      );

      const planId: number = queryResult.rows[0][0];

      switch (plan.category) {
        case 'Famille':
          
        case 'Pescetarien':

        case 'Vegetarien':
      }
    });

    return router;
  }
}
