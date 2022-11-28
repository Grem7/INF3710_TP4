import { Component, OnInit } from "@angular/core";
import { MealPlanInfo } from "../../../../common/tables/mealplan-info";
import { ProviderInfo } from "../../../../common/tables/provider-info";
import { CommunicationService } from "../services/communication.service";

@Component({
  selector: "add-page",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"],
})
export class AddComponent implements OnInit {
    id: number;
    category: string;
    subcategory: string;
    mealType: string;
    fishBreed: string;
    frequency: string;
    prepTime: number;
    nbIngredients: number;
    calories: number;
    nbPeople: number;
    price: number;
    provider: ProviderInfo;
    providers: ProviderInfo[];

    constructor (private communicationService: CommunicationService) {}

    public ngOnInit(): void {
        this.communicationService.getProviders().subscribe((newProviders) => this.providers = newProviders);
    }

    onSubmit() {
      const mealplan = {
        id: this.id,
        category: this.category,
        frequency: this.frequency,
        nbPeople: this.nbPeople,
        calories: this.calories,
        price: this.price,
        provider: this.provider,
        fishBreed: this.category == 'Pescetarien' ? this.fishBreed : null,
        mealType: this.category == 'Vegetarien' ? this.mealType : null,
        prepTime: this.category == 'Famille' && this.subcategory == 'Rapide' ? this.prepTime : null,
        nbIngredients: this.category == 'Famille' && this.subcategory == 'Facile' ? this.nbIngredients : null
      };

      this.communicationService.addMealplan(mealplan as MealPlanInfo).subscribe();
    }
}
