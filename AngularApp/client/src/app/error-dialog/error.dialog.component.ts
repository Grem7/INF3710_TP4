import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "error-dialog",
  templateUrl: "./error.dialog.component.html",
  styleUrls: ["./error.dialog.component.css"],
})
export class ErrorDialogComponent implements OnInit {
    message: string;

    constructor (public dialogRef: MatDialogRef<ErrorDialogComponent>, @Inject(MAT_DIALOG_DATA) data: string) {
        this.message = data;
    }

    public ngOnInit(): void {
    }
}
