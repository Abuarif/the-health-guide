import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Food, FoodGroup } from '../models';

export const FOOD_GROUPS: Array<FoodGroup> = [
  new FoodGroup('', 'All foods'),
  new FoodGroup('3500', 'American Indian/Alaska Native Foods'),
  new FoodGroup('0300', 'Baby Foods'),
  new FoodGroup('1800', 'Baked Products'),
  new FoodGroup('1300', 'Beef Products'),
  new FoodGroup('1400', 'Beverages'),
  new FoodGroup('0800', 'Breakfast Cereals'),
  new FoodGroup('2000', 'Cereal Grains and Pasta'),
  new FoodGroup('0100', 'Dairy and Egg Products'),
  new FoodGroup('2100', 'Fast Foods'),
  new FoodGroup('0400', 'Fats and Oils'),
  new FoodGroup('1500', 'Finfish and Shellfish Products'),
  new FoodGroup('0900', 'Fruits and Fruit Juices'),
  new FoodGroup('1700', 'Lamb, Veal, and Game Products'),
  new FoodGroup('1600', 'Legumes and Legume Products'),
  new FoodGroup('2200', 'Meals, Entrees, and Side Dishes'),
  new FoodGroup('1200', 'Nut and Seed Products'),
  new FoodGroup('1000', 'Pork Products'),
  new FoodGroup('0500', 'Poultry Products'),
  new FoodGroup('3600', 'Restaurant Foods'),
  new FoodGroup('0700', 'Sausages and Luncheon Meats'),
  new FoodGroup('2500', 'Snacks'),
  new FoodGroup('0600', 'Soups, Sauces, and Gravies'),
  new FoodGroup('0200', 'Spices and Herbs'),
  new FoodGroup('1900', 'Sweets'),
  new FoodGroup('1100', 'Vegetables and Vegetable Products'),
];

@Injectable()
export class FoodService {
  private _usdaApiKey: string = '5nW8It7ORsxY212bV5wpleHkblTLbvpFTKVa010U';
  private _usdaSource: string = 'Standard+Reference';
  private _foodListUrl: string = 'https://api.nal.usda.gov/ndb/search/';
  private _foodNutritionUrl: string = 'https://api.nal.usda.gov/ndb/reports/';
  constructor(private _http: Http) { }

  private _serializeFood(usdaFood: any): Food {
    let newFood: Food = new Food(usdaFood['ndbno'], usdaFood['name'], usdaFood['fg']);
    newFood.nutrition.setNutrientValue(usdaFood['nutrients']);
    console.log(newFood);
    return newFood;
  }

  public getFoodReports$(foodId: string = ''): Promise<Food> {
    let headers: Headers = new Headers({ 'Content-Type': 'application/json' }),
      options: RequestOptions = new RequestOptions(),
      params: URLSearchParams = new URLSearchParams();

    params.set('api_key', this._usdaApiKey);
    params.set('ndbno', foodId);
    params.set('type', 'f');
    options.headers = headers;
    options.search = params;

    return new Promise((resolve, reject) => {
      this._http.get(this._foodNutritionUrl, options)
        .map((res: Response) => {
          let body = res.json();
          console.log(body);
          if (body.hasOwnProperty('errors')) {
            console.log(body.errors);
            return null;
          }

          return this._serializeFood(body['report']['food']);
        }).subscribe((data: Food) => {
          if (!!data) {
            resolve(data);
          } else {
            reject(data);
          }
        });
    });
  }

  public getFoods$(searhQuery: string = '', start: number = 0, limit: number = 100, foodGroupId: string = ''): Observable<Array<Food>> {
    let headers: Headers = new Headers({ 'Content-Type': 'application/json' }),
      options: RequestOptions = new RequestOptions(),
      params: URLSearchParams = new URLSearchParams();

    params.set('api_key', this._usdaApiKey);
    params.set('ds', this._usdaSource);
    params.set('q', searhQuery);
    params.set('fg', foodGroupId);
    params.set('format', 'json');
    params.set('sort', 'n');
    params.set('max', `${limit}`);
    params.set('offset', `${start}`);
    options.headers = headers;
    options.search = params;

    return this._http.get(this._foodListUrl, options)
      .map((res: Response) => {
        let body = res.json();
        console.log(body);
        if (body.hasOwnProperty('errors')) {
          console.log(body.errors);
          throw body.errors.error[0];
        }
        return body['list']['item'];
      }).catch((err: any) => Observable.throw(err));
  }
}
