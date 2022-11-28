import { Component, OnInit } from "@angular/core";
import { MealPlanInfo } from "../../../../common/tables/mealplan-info";
import { CommunicationService } from "../services/communication.service";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "../delete-dialog/delete.dialog.component";
import { EditDialogComponent } from "../edit-dialog/edit.dialog.component";

@Component({
  selector: "mealplans-page",
  templateUrl: "./mealplans.component.html",
  styleUrls: ["./mealplans.component.css"],
})
export class MealplanComponent implements OnInit {
    mealplans: MealPlanInfo[];
    constructor (private communicationService: CommunicationService, private dialog: MatDialog) {}

    public ngOnInit(): void {
        this.communicationService.getMealplans().subscribe((newMealplans: MealPlanInfo[]) => this.mealplans = newMealplans);
    }

    public openEditDialog(mealplan: MealPlanInfo) {
        this.dialog.open(EditDialogComponent, {
            data: mealplan,
            minWidth: '500px'
        })
        .afterClosed().subscribe(mustUpdate => {
            if (!mustUpdate) return;

            this.communicationService.updateMealplan(mealplan).subscribe();
        })
    }

    public openDeleteDialog(mealplan: MealPlanInfo) {
        this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(mustDelete => {
            if (!mustDelete) return;

            this.communicationService.deleteMealplan(mealplan.id).subscribe(_ => {
                this.communicationService.getMealplans().subscribe((newMealplans: MealPlanInfo[]) => this.mealplans = newMealplans);
            });
        });
    }
}
