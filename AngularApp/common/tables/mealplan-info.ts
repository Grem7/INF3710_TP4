export type MealPlanInfo = {
    id: number,
    category: string,
    frequency: string,
    nbPeople: number,
    calories: number,
    price: number,
    provider: {
        id: number,
        name: string,
        address: string
    }
}