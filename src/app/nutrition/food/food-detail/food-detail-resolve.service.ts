import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { DataService } from '../../shared/data.service';
import { Food } from '../shared/food.model';

@Injectable()
export class FoodDetailResolve implements Resolve<Food> {
  constructor(private _dataSvc: DataService) { }

  public resolve(route: ActivatedRouteSnapshot): Promise<Food> {
    return new Promise((resolve, reject) => {
      resolve(this._dataSvc.getFood());
    });
  }

}
