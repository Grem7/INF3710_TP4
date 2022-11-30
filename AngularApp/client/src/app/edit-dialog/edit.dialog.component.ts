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
    editedMealplan: any;
    originalMealplan: MealPlanInfo;
    subcategory: string;
    providers: ProviderInfo[];

    constructor (public communicationService: CommunicationService, public dialogRef: MatDialogRef<EditDialogComponent>, @Inject(MAT_DIALOG_DATA) data: MealPlanInfo) {
        this.originalMealplan = data;
        this.editedMealplan = {};

        for (const key in data) (this.editedMealplan)[key] = (data as any)[key]; // We copy everything from data over to editedMealplan

        if (data.category == 'Famille' && (data as any).prepTime) this.subcategory = 'Rapide';
        if (data.category == 'Famille' && (data as any).nbIngredients) this.subcategory = 'Facile';
    }

    public ngOnInit(): void {
        this.communicationService.getProviders().subscribe(newProviders => {
            const currentProvider = newProviders.find(el => el.id = this.editedMealplan.provider.id);
            if (currentProvider) this.editedMealplan.provider = currentProvider;
            this.providers = newProviders;
        });
    }

    public getDelta(): any {
        const delta: any = {};
        
        for (const key in this.editedMealplan) {
            if (this.editedMealplan[key] != (this.originalMealplan as any)[key]) {
                delta[key] = {
                    oldValue: (this.originalMealplan as any)[key],
                    newValue: this.editedMealplan[key]
                }
            }
        }
        for (const key in this.originalMealplan) {
            if (this.editedMealplan[key] != (this.originalMealplan as any)[key] && !delta[key]) {
                delta[key] = {
                    oldValue: (this.originalMealplan as any)[key],
                    newValue: this.editedMealplan[key]
                }
            }
        }
        
        return delta;
    }
}
