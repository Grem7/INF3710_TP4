import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MealPlanInfo } from "../../../../common/tables/mealplan-info";
import { ProviderInfo } from "../../../../common/tables/provider-info";
import { CommunicationService } from "../services/communication.service";

@Component({
  selector: "edit-dialog",
  templateUrl: "./edit.dialog.component.html",
  styleUrls: ["./edit.dialog.component.css"],
})
export class EditDialogComponent implements OnInit {
    mealplan: MealPlanInfo;
    subcategory: string;
    providers: ProviderInfo[];

    constructor (public communicationService: CommunicationService, public dialogRef: MatDialogRef<EditDialogComponent>, @Inject(MAT_DIALOG_DATA) data: MealPlanInfo) {
        this.mealplan = data;

        if (this.mealplan.category == 'Famille' && (this.mealplan as any).prepTime) this.subcategory = 'Rapide';
        if (this.mealplan.category == 'Famille' && (this.mealplan as any).nbIngredients) this.subcategory = 'Facile';
    }

    public ngOnInit(): void {
        this.communicationService.getProviders().subscribe(newProviders => {
            const currentProvider = newProviders.find(el => el.id = this.mealplan.provider.id);
            if (currentProvider) this.mealplan.provider = currentProvider;
            this.providers = newProviders
        });
    }
}
