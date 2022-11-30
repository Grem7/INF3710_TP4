// À DÉCOMMENTER ET À UTILISER LORSQUE VOTRE COMMUNICATION EST IMPLÉMENTÉE
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, of, catchError } from "rxjs";
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

  getMealplans(): Observable<MealPlanInfo[]> {
    console.log(this.BASE_URL + '/mealplans');
    return this.http.get<MealPlanInfo[]>(this.BASE_URL + '/mealplans');
  }

  updateMealplan(id: number, delta: any) : Observable<number> {
    return this.http.put<number>(this.BASE_URL + `/mealplans/${id}`, delta)
    .pipe(catchError(this.handleError<number>("updateMealplan")));
  }

  deleteMealplan(id: number) : Observable<number> {
    console.log(`${this.BASE_URL}/mealplans/${id}`);
    return this.http.delete<number>(`${this.BASE_URL}/mealplans/${id}`)
    .pipe(catchError(this.handleError<number>("deleteMealplan")));
  }

  addMealplan(mealplan: MealPlanInfo) : Observable<number> {
    return this.http.post<any>(this.BASE_URL + '/mealplans', mealplan)
    .pipe(catchError(this.handleError<number>("addMealplan")));
  }

  // À DÉCOMMENTER ET À UTILISER LORSQUE VOTRE COMMUNICATION EST IMPLÉMENTÉE
  private handleError<T>(
     request: string,
     result?: T
   ): (error: Error) => Observable<T> {
     return (error: Error): Observable<T> => {
       return of(result as T);
     };
   }
}
