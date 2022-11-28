import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "../app.component";
import { AddComponent } from "../add-page/add.component";
import { MealplanComponent } from "../mealplans-page/mealplans.component";

const routes: Routes = [
  { path: "app", component: AppComponent },
  { path: "add", component: AddComponent },
  { path: "mealplans", component: MealplanComponent }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
