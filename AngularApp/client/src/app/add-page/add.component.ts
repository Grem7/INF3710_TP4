import { Component, OnInit } from "@angular/core";
import { ProviderInfo } from "../../../../common/tables/provider-info";
import { CommunicationService } from "../services/communication.service";

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
    frequency: string;
    prepTime: number;
    nbIngredients: number;
    calories: number;
    nbPeople: number;
    price: number;
    providerId: number;
    providers: ProviderInfo[];

    constructor (private communicationService: CommunicationService) {}

    public ngOnInit(): void {
        this.communicationService.getProviders().subscribe((newProviders) => this.providers = newProviders);
    }
}
