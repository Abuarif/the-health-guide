import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth-guard.service';
import { CanDeactivateGuard } from '../shared/can-deactivate-guard.service';
import { FitnessComponent } from './fitness/fitness.component';
import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodDetailResolve } from './food/food-detail/food-detail-resolve.service';
import { FoodListComponent } from './food/food-list/food-list.component';
import { MealNutritionComponent } from './fitness/meal-nutrition/meal-nutrition.component';
import { NutrientDetailComponent } from './nutrients/nutrient-detail/nutrient-detail.component';
import { NutrientDetailResolve } from './nutrients/nutrient-detail/nutrient-detail-resolve.service';
import { NutrientListComponent } from './nutrients/nutrient-list/nutrient-list.component';
import { NutritionComponent } from './nutrition.component';
import { NutritionInfoComponent } from './nutrition-info/nutrition-info.component';
import { RecipeDetailResolve } from './recipes/recipe-detail/recipe-detail-resolve.service';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';

const nutritionRoutes: Routes = [
    {
        path: 'nutrition',
        canActivate: [AuthGuard],
        component: NutritionComponent,
        children: [
            {
                path: 'fitness',
                children: [
                    {
                        path: 'meal-nutrition',
                        component: MealNutritionComponent
                    },
                    {
                        path: '',
                        component: FitnessComponent
                    }
                ]
            },
            {
                path: 'food',
                canActivateChild: [AuthGuard],
                children: [
                    {
                        path: ':key',
                        component: FoodDetailComponent,
                        resolve: {
                            food: FoodDetailResolve
                        }
                    },
                    {
                        path: '',
                        component: FoodListComponent
                    }
                ]
            },
            {
                path: 'nutrients',
                canActivateChild: [AuthGuard],
                children: [
                    {
                        path: ':category/:key',
                        component: NutrientDetailComponent,
                        resolve: {
                            nutrient: NutrientDetailResolve
                        }
                    },
                    {
                        path: '',
                        component: NutrientListComponent
                    }
                ]
            },
            {
                path: 'recipes',
                canActivateChild: [AuthGuard],
                children: [
                    {
                        path: ':authId/:key',
                        component: RecipeDetailComponent,
                        resolve: {
                            recipe: RecipeDetailResolve
                        }
                    },
                    {
                        path: ':authId/:key/edit',
                        component: RecipeEditComponent,
                        resolve: {
                            recipe: RecipeDetailResolve
                        },
                        canDeactivate: [CanDeactivateGuard]
                    },
                    {
                        path: '',
                        component: RecipeListComponent
                    }
                ]
            },
            {
                path: '',
                canActivateChild: [AuthGuard],
                component: NutritionInfoComponent,
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(nutritionRoutes)],
    exports: [RouterModule]
})
export class NutritionRoutingModule { }