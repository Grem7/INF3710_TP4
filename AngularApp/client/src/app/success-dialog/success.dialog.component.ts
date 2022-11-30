import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "success-dialog",
  templateUrl: "./success.dialog.component.html",
  styleUrls: ["./success.dialog.component.css"],
})
export class SuccessDialogComponent implements OnInit {
    message: string;

    constructor (public dialogRef: MatDialogRef<SuccessDialogComponent>, @Inject(MAT_DIALOG_DATA) data: string) {
        this.message = data;
    }

    public ngOnInit(): void {
    }
}
