import { Component, OnInit } from "@angular/core";
import { MealPlanInfo } from "../../../../common/tables/mealplan-info";
import { CommunicationService } from "../services/communication.service";

@Component({
  selector: "mealplans-page",
  templateUrl: "./mealplans.component.html",
  styleUrls: ["./mealplans.component.css"],
})
export class MealplanComponent implements OnInit {
    mealplans: MealPlanInfo[];
    constructor (private communicationService: CommunicationService) {}

    public ngOnInit(): void {
        this.communicationService.getMealplans().subscribe((newMealplans: MealPlanInfo[]) => this.mealplans = newMealplans);
    }

    public openEditDialog(mealplan: MealPlanInfo) {

    }

    public openDeleteDialog(mealplan: MealPlanInfo) {
        this.communicationService.deleteMealplan(mealplan.id).subscribe();
        this.communicationService.getMealplans().subscribe((newMealPlans: MealPlanInfo[]) => this.mealplans = newMealPlans);
    }
}
