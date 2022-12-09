import { Component, OnInit } from "@angular/core";
import { MealPlanInfo } from "../../../../common/tables/mealplan-info";
import { CommunicationService } from "../services/communication.service";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "../delete-dialog/delete.dialog.component";
import { EditDialogComponent } from "../edit-dialog/edit.dialog.component";
import { ErrorDialogComponent } from "../error-dialog/error.dialog.component";
import { SuccessDialogComponent } from "../success-dialog/success.dialog.component";
import { ProviderInfo } from "../../../../common/tables/provider-info";

@Component({
  selector: "mealplans-page",
  templateUrl: "./mealplans.component.html",
  styleUrls: ["./mealplans.component.css"],
})
export class MealplanComponent implements OnInit {
    mealplans: MealPlanInfo[];
    providers: ProviderInfo[];

    constructor (private communicationService: CommunicationService, private dialog: MatDialog) {}

    public ngOnInit(): void {
        this.fetchMealplans();
        this.fetchProviders();
    }

    public fetchMealplans() {
        this.communicationService.getMealplans().subscribe((newMealplans: MealPlanInfo[]) => this.mealplans = newMealplans);
    }

    public fetchProviders() {
        this.communicationService.getProviders().subscribe((newProviders: ProviderInfo[]) => {this.providers = newProviders; console.log(newProviders)});
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

    public openEditDialog(mealplanToEdit: MealPlanInfo) {
        console.log(this.providers);
        
        this.dialog.open(EditDialogComponent, {
            data: {
                mealplan: mealplanToEdit,
                providers: this.providers
            },
            minWidth: '500px'
        })
        .afterClosed().subscribe(delta => {
            if (!delta) return;

            this.communicationService.updateMealplan(mealplanToEdit.id, delta).subscribe(rowCount => {
                this.fetchMealplans();
                if (rowCount < 0) this.displayError("Les nouvelles valeurs entrées n'étaient pas toutes valides");
                else this.displaySuccess("La modification est été effectuée avec succès!");
            });
        })
    }

    public openDeleteDialog(mealplan: MealPlanInfo) {
        this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(mustDelete => {
            if (!mustDelete) return;

            this.communicationService.deleteMealplan(mealplan.id).subscribe(rowCount => {
                this.fetchMealplans();
                if (rowCount < 0) this.displayError("Impossible de supprimer cet élément. Il est possible qu'il est déjà été supprimé");
                else this.displaySuccess("La suppression s'est effectuée avec succès!");
            });
        });
    }
}
