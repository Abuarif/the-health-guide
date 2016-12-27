import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { AuthService } from '../../../auth/auth.service';
import { HelperService } from '../../../shared/helper.service';
import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

const recipeImgUrl: string = 'https://firebasestorage.googleapis.com/v0/b/the-health-guide.appspot.com/o/recipes%2Frecipe.jpg?alt=media&token=c645fc32-7273-43f5-a198-33b8a041a719';

@Injectable()
export class RecipeDataService {
  private recipeImgUrl: firebase.storage.Reference;
  private sharedRecipes: FirebaseListObservable<Recipe[]>;
  private userRecipes: FirebaseListObservable<Recipe[]>;
  constructor(private af: AngularFire, private authSvc: AuthService, private helperSvc: HelperService) {
    this.userRecipes = af.database.list(`/recipes/${authSvc.getAuth().id}`, {
      query: {
        orderByChild: 'name'
      }
    });
    this.sharedRecipes = af.database.list('/recipes/shared', {
      query: {
        orderByChild: 'name'
      }
    });
    this.recipeImgUrl = firebase.storage().ref().child('/recipes');
  }

  public addRecipe(recipe: Recipe): void {
    this.helperSvc.removeHashkeys(recipe.ingredients);
    recipe.image = (recipe.image === "") ? recipeImgUrl : recipe.image;
    this.userRecipes.push(recipe);
    if (recipe.shared === true) {
      this.sharedRecipes.push(recipe);
    }
  }

  public downloadImg(imgName: string): firebase.Promise<any> {
    return this.recipeImgUrl.child(`${imgName}`).getDownloadURL();
  }

  public getMyRecipes(): FirebaseListObservable<Recipe[]> {
    return this.userRecipes;
  }

  public getRecipe(authId: string, key: string): FirebaseObjectObservable<Recipe> {
    return this.af.database.object(`/recipes/${authId}/${key}`, {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public getSharedRecipes(): FirebaseListObservable<Recipe[]> {
    return this.sharedRecipes;
  }

  public removeRecipe(recipe: Recipe): void {
    this.userRecipes.remove(recipe['$key']);
    if (recipe.shared === true) {
      this.sharedRecipes.remove(recipe['$key']);
    }
  }

  public updateRecipe(recipe: Recipe): void {
    this.helperSvc.removeHashkeys(recipe.ingredients);
    recipe.image = (recipe.image === "") ? recipeImgUrl : recipe.image;
    this.userRecipes.update(recipe['$key'], {
      name: recipe.name,
      description: recipe.description,
      image: recipe.image,
      category: recipe.category,
      tags: recipe.tags,
      goodPoints: recipe.goodPoints,
      badPoints: recipe.badPoints,
      chef: recipe.chef,
      ingredients: recipe.ingredients,
      duration: recipe.duration,
      difficulty: recipe.difficulty,
      cookMethod: recipe.cookMethod,
      cookTemperature: recipe.cookTemperature,
      nutrition: recipe.nutrition,
      servings: recipe.servings,
      instructions: recipe.instructions,
      quantity: recipe.quantity,
      shared: recipe.shared
    });

    if (recipe.shared === true) {
      this.sharedRecipes.update(recipe['$key'], {
        name: recipe.name,
        description: recipe.description,
        image: recipe.image,
        category: recipe.category,
        tags: recipe.tags,
        goodPoints: recipe.goodPoints,
        badPoints: recipe.badPoints,
        chef: recipe.chef,
        ingredients: recipe.ingredients,
        duration: recipe.duration,
        difficulty: recipe.difficulty,
        cookMethod: recipe.cookMethod,
        cookTemperature: recipe.cookTemperature,
        nutrition: recipe.nutrition,
        servings: recipe.servings,
        instructions: recipe.instructions,
        quantity: recipe.quantity,
        shared: recipe.shared
      });
    }
  }

  public uploadImage(img: File): firebase.storage.UploadTask {
    return this.recipeImgUrl.child(img.name).put(img);
  }

}