import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodComponent } from './food.component';
import { FoodDetailComponent } from './food-detail/food-detail.component';
import { FoodInfoComponent } from './food-info/food-info.component';
import { FoodListComponent } from './food-list/food-list.component';
import { FoodListResolveService } from './food-list/food-list-resolve.service'

const foodRoutes: Routes = [
    {
        path: 'food',
        component: FoodComponent,
        children: [
            {
                path: 'list',
                component: FoodListComponent,
                resolve: {
                    foods: FoodListResolveService
                }
            },
            {
                path: '',
                component: FoodInfoComponent
            },
            {
                path: ':id',
                component: FoodDetailComponent
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(foodRoutes)],
    exports: [RouterModule]
})
export class FoodRoutingModule { }