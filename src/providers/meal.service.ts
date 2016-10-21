import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuth, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
// import { Immutable } from 'immutable/dist';

// Models
import { Fitness, MealJournal, Nutrition } from '../models';

// Providers
import { ActivityService } from './activity.service';
import { FitnessService } from './fitness.service';
import { NutritionService } from './nutrition.service';


@Injectable()
export class MealService {
    private energyConsum: number = 0;
    private mealJournals: FirebaseListObservable<MealJournal[]>;
    private userFitness: Fitness = new Fitness();

    constructor(
        private activitySvc: ActivityService,
        private af: AngularFire,
        private auth: FirebaseAuth,
        private fitnessSvc: FitnessService,
        private nutritionSvc: NutritionService
    ) {
        auth.subscribe(authData => {
            if (!!authData) {
                this.mealJournals = af.database.list(`/meal-journals/${authData.uid}`, {
                    query: {
                        orderByChild: 'date'
                    }
                });
            }
        });

        activitySvc.getAjByDate().subscribe(aj => {
            if(!!aj) {
                this.energyConsum = aj.totalEnergy;
            }
        });

        fitnessSvc.getFitness().subscribe(fitness => {
            if (!!fitness) {
                this.userFitness = fitness;
            }
        });
    }

    private getMjRemainingNutrition(mj: MealJournal): Nutrition {
        // Percentage calculations
        let nutrition = new Nutrition();
        for (let nutrientGroup in mj.requiredNutrition) {
            let reqNutrients = mj.requiredNutrition[nutrientGroup],
                totalNutrients = mj.totalNutrition[nutrientGroup];
            if (nutrientGroup === 'energy') {
                if (reqNutrients > 0) {
                    nutrition[nutrientGroup] = (totalNutrients / reqNutrients) * 100;
                } else {
                    nutrition[nutrientGroup] = (totalNutrients === 0) ? 100 : 100 + totalNutrients;
                }
            }
            for (let nutrient in reqNutrients) {
                if (reqNutrients[nutrient] > 0) {
                    nutrition[nutrientGroup][nutrient] = (totalNutrients[nutrient] / reqNutrients[nutrient]) * 100;
                } else {
                    nutrition[nutrientGroup][nutrient] = (totalNutrients[nutrient] === 0) ? 100 : 100 + totalNutrients[nutrient];
                }
            }
        }

        return nutrition;
    }

    private getMjTotalNutrition(mj: MealJournal): Nutrition {
        let nutrition = new Nutrition();
        for (let nutrientGroup in nutrition) {
            if (nutrientGroup === 'energy') {
                nutrition[nutrientGroup] += mj.breakfast.total[nutrientGroup] +
                    mj.brunch.total[nutrientGroup] +
                    mj.lunch.total[nutrientGroup] +
                    mj.snack.total[nutrientGroup] +
                    mj.dinner.total[nutrientGroup];
            }
            // Set total intake for each nutrient in the nutrient groups
            for (let nutrient in nutrition[nutrientGroup]) {
                nutrition[nutrientGroup][nutrient] += mj.breakfast.total[nutrientGroup][nutrient] +
                    mj.brunch.total[nutrientGroup][nutrient] +
                    mj.lunch.total[nutrientGroup][nutrient] +
                    mj.snack.total[nutrientGroup][nutrient] +
                    mj.dinner.total[nutrientGroup][nutrient];
            }
        }
        return nutrition;
    }

    private removeHashkeys(mj: MealJournal): void {
        for (let prop in mj) {
            if (mj[prop].hasOwnProperty('meals')) {
                mj[prop].meals.forEach(meal => {
                    if (meal.hasOwnProperty('$key')) {
                        delete meal['$key'];
                    }
                    if (meal.hasOwnProperty('$exists')) {
                        delete meal['$exists'];
                    }
                });
            }
        }
    }

    private setMealTimeNutrition(mj: MealJournal): void {
        for (let prop in mj) {
            let mealTime = mj[prop];
            if (mealTime.hasOwnProperty('meals') && mealTime.meals.length > 0) {
                mealTime.total = new Nutrition();
                mealTime.meals.forEach(meal => {
                    if (meal.hasOwnProperty['$key']) {
                        delete meal['$key'];
                    }
                    if (meal.hasOwnProperty['$exists']) {
                        delete meal['$exists'];
                    }
                    if (meal.hasOwnProperty("chef")) {
                        // The meal is a recipe
                        for (let nutrientGroup in meal.nutrients) {
                            let nutrients = meal.nutrients[nutrientGroup];
                            if (nutrientGroup === 'energy') {
                                mealTime.total[nutrientGroup] += nutrients * meal.amount;
                            } else if (typeof nutrients === 'object') {
                                for (let nutrient in nutrients) {
                                    mealTime.total[nutrientGroup][nutrient] += nutrients[nutrient] * meal.amount;
                                }
                            }
                        }
                    } else {
                        // The meal is a basic food
                        for (let nutrientGroup in meal) {
                            let nutrients = meal[nutrientGroup];
                            if (nutrientGroup === 'energy') {
                                mealTime.total[nutrientGroup] += nutrients * (meal.amount / 100);
                            } else if (typeof nutrients === 'object') {
                                for (let nutrient in nutrients) {
                                    mealTime.total[nutrientGroup][nutrient] += nutrients[nutrient] * (meal.amount / 100);
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    public addMealJournal(mj: MealJournal): void {
        console.log(mj);
        this.removeHashkeys(mj);
        this.mealJournals.push(mj)
    }

    public getMealJournals(): FirebaseListObservable<MealJournal[]> {
        return this.mealJournals;
    }

    public getMjByDate(date: string): Observable<any> {
        return new Observable(observer => {
            let journal: MealJournal = new MealJournal();
            this.getMealJournals().subscribe(mealJournals => {
                if (!!mealJournals) {
                    journal = mealJournals.filter(mj => mj.date === date)[0];
                    if (!!journal) {
                        observer.next(journal);
                    }
                }
            });
        });
    }

    public removeMealJournal(mj: MealJournal): void {
        this.mealJournals.remove(mj['$key']);
    }

    public setMjNutrition(mj: MealJournal): void {
        mj.requiredNutrition = this.nutritionSvc.getNutritionRequirements(this.energyConsum, this.userFitness);
        this.setMealTimeNutrition(mj);
        mj.totalNutrition = this.getMjTotalNutrition(mj);
        mj.remainingNutrition = this.getMjRemainingNutrition(mj);
    }

    public updateMealJournal(mj: MealJournal): void {
        console.log(mj);
        this.removeHashkeys(mj);
        this.mealJournals.update(mj['$key'], {
            date: mj.date,
            breakfast: mj.breakfast,
            brunch: mj.brunch,
            lunch: mj.lunch,
            snack: mj.snack,
            dinner: mj.dinner,
            remainingNutrition: mj.remainingNutrition,
            requiredNutrition: mj.requiredNutrition,
            totalNutrition: mj.totalNutrition
        });
    }
}