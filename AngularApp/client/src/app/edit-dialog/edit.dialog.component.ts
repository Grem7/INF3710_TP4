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

    constructor (public communicationService: CommunicationService, public dialogRef: MatDialogRef<EditDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
        this.originalMealplan = data.mealplan;
        this.providers = data.providers;
        this.editedMealplan = {};

        for (const key in this.originalMealplan) (this.editedMealplan)[key] = (this.originalMealplan as any)[key]; // We copy everything from data over to editedMealplan

        if (data.category == 'Famille' && (data as any).prepTime) this.subcategory = 'Rapide';
        if (data.category == 'Famille' && (data as any).nbIngredients) this.subcategory = 'Facile';

        for (const provider of this.providers) {
            if (provider.id == this.originalMealplan.provider.id) {
                this.editedMealplan.provider = provider;
                break;
            }
        }
    }

    public ngOnInit(): void {

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
