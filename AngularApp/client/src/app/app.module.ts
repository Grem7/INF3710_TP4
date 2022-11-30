import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./modules/app-routing.module";
import { AppComponent } from "./app.component";
import { CommunicationService } from "./services/communication.service";
import { AppMaterialModule } from './modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MealplanComponent } from "./mealplans-page/mealplans.component";
import { DeleteDialogComponent } from "./delete-dialog/delete.dialog.component";
import { EditDialogComponent } from "./edit-dialog/edit.dialog.component";
import { ErrorDialogComponent } from "./error-dialog/error.dialog.component";
import { SuccessDialogComponent } from "./success-dialog/success.dialog.component";
import { AddComponent } from "./add-page/add.component";

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    MealplanComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    ErrorDialogComponent,
    SuccessDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppMaterialModule
  ],
  providers: [CommunicationService],
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
