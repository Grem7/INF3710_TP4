import { Component, OnInit } from "@angular/core";
import { MealPlanInfo } from "../../../../common/tables/mealplan-info";
import { ProviderInfo } from "../../../../common/tables/provider-info";
import { ErrorDialogComponent } from "../error-dialog/error.dialog.component";
import { CommunicationService } from "../services/communication.service";
import { MatDialog } from "@angular/material/dialog";
import { SuccessDialogComponent } from "../success-dialog/success.dialog.component";


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

    constructor (private communicationService: CommunicationService, private dialog: MatDialog) {}

    public ngOnInit(): void {
        this.communicationService.getProviders().subscribe((newProviders) => this.providers = newProviders);
    }

    public displayError(msg: string) {
      this.dialog.open(ErrorDialogComponent, {
          data: msg,
          minWidth: '250px'
      });
    }

    public displaySuccess(msg: string) {
      this.dialog.open(SuccessDialogComponent, {
        data: msg,
        minWidth: '250px'
      });
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

      this.communicationService.addMealplan(mealplan as MealPlanInfo).subscribe(rowCount => {
        if (rowCount < 0) this.displayError("L'insertion a échouée, il est possible qu'une des valeurs entrées soit invalid");
        else this.displaySuccess("L'insertion a réussi!");
      });
    }
}
