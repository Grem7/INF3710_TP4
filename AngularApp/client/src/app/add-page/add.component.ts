import { Component, OnInit } from "@angular/core";

@Component({
  selector: "add-page",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"],
})
export class AddComponent implements OnInit {
    category: string;
    subcategory: string;
    mealType: string;
    fishBreed: string;
    frequence: string;
    calories: number;
    nbPeople: number;
    price: number;

    public ngOnInit(): void { }
}
