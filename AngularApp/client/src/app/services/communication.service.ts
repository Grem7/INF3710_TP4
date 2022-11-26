// À DÉCOMMENTER ET À UTILISER LORSQUE VOTRE COMMUNICATION EST IMPLÉMENTÉE
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ProviderInfo } from "../../../../common/tables/provider-info"
import { MealPlanInfo } from "../../../../common/tables/mealplan-info"

@Injectable()
export class CommunicationService {
  // À DÉCOMMENTER ET À UTILISER LORSQUE VOTRE COMMUNICATION EST IMPLÉMENTÉE
  private readonly BASE_URL: string = "http://localhost:3000/database";
  public constructor(private readonly http: HttpClient) {}

  private _listeners: any = new Subject<any>();

  listen(): Observable<any> {
    return this._listeners.asObservable();
  }

  filter(filterBy: string): void {
    this._listeners.next(filterBy);
  }

  getProviders(): Observable<ProviderInfo[]> {
    return this.http.get<ProviderInfo[]>(this.BASE_URL + '/providers');
  }

  postMealPlan(mealPlan: MealPlanInfo) : Observable<any> {
    return this.http.post<any>(this.BASE_URL + '/mealPlans', mealPlan);
  }

  // À DÉCOMMENTER ET À UTILISER LORSQUE VOTRE COMMUNICATION EST IMPLÉMENTÉE
  // private handleError<T>(
  //   request: string,
  //   result?: T
  // ): (error: Error) => Observable<T> {
  //   return (error: Error): Observable<T> => {
  //     return of(result as T);
  //   };
  // }
}
