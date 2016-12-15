import { Injectable } from '@angular/core';

import { DataService } from '../../../fitness/shared/data.service';
import { Fitness } from '../../../fitness/fitness.model';
import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

@Injectable()
export class RecipeService {
  private tags: any;
  constructor(private dataSvc: DataService) {
    this.tags = {
      dairyFree: true,
      glutenFree: true,
      soyFree: true,
      vegan: true
    }
  }

  private checkCarbTags(recipe: Recipe): void {
    let energy: number = recipe.nutrition.Energy,
      reqEnergy: number = (recipe.category === 'Breakfasts') ? 900 : 450,
      reqCarb: number = energy * 0.45 / 4.1,
      reqFiber: number = energy * 0.06 / 2,
      reqSugars: number = energy * 0.15 / 2.4;

    if (recipe.nutrition.Fiber > reqFiber) {
      recipe.tags.push('High-fiber');
    } else if (recipe.nutrition.Fiber <= reqFiber / 2) {
      recipe.tags.push('Low-fiber');
    }

    if (recipe.nutrition.Sugars > reqSugars) {
      recipe.tags.push('High-sugar');
    } else if (recipe.nutrition.Sugars <= reqSugars / 2) {
      recipe.tags.push('Low-sugar');
    }

    if (recipe.nutrition.Carbohydrates > reqCarb) {
      recipe.tags.push('High-carb');
    } else if (recipe.nutrition.Sugars <= reqSugars / 2) {
      recipe.tags.push('Low-carb');
    }

  }

  private checkCarbLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200 || recipe.cookMethod === 'Boiling') {
      recipe.nutrition.Carbohydrates -= recipe.nutrition.Carbohydrates * 0.15;
      recipe.nutrition.Fiber -= recipe.nutrition.Fiber * 0.15;
      recipe.nutrition.Sugars -= recipe.nutrition.Sugars * 0.15;
    }
    if (recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching') {
      recipe.nutrition.Carbohydrates -= recipe.nutrition.Carbohydrates * 0.5;
      recipe.nutrition.Fiber -= recipe.nutrition.Fiber * 0.5;
      recipe.nutrition.Sugars -= recipe.nutrition.Sugars * 0.5;
    }
  }

  private checkEnergyTags(recipe: Recipe): void {
    let energy: number = recipe.nutrition.Energy,
      reqEnergy: number = (recipe.category === 'Breakfasts') ? 900 : 450

    if (energy > reqEnergy) {
      recipe.tags.push('High-calorie');
    } else if (energy <= reqEnergy / 2) {
      recipe.tags.push('Low-calorie');
    }
  }

  private checkHealthTags(recipe: Recipe): void {
    /**
     * The optimal recipe must have max. 900 kcal if it's a breakfast, 450 kcal otherwise,
     * and must contain 45% carbs, 35% fat, 6% fiber, 20% protein, 15% sugars, 10% saturated fat
     * 
     * Carbs have 4.1 kcal/g
     * Fat has 9 kcal/g
     * Fiber has 2 kcal/g
     * Protein has 4.1 kcal/g
     * Sugars have 2.4 kcal/g
     */
    recipe.tags.splice(0, recipe.tags.length);
    this.checkEnergyTags(recipe);
    this.checkProteinTags(recipe);
    this.checkLipidTags(recipe);
    this.checkCarbTags(recipe);
    this.checkIngredientTags(recipe);
  }

  private checkIngredientTags(recipe: Recipe): void {
    if (this.tags.dairyFree) {
      recipe.tags.push('Dairy-free');
    }

    if (this.tags.glutenFree) {
      recipe.tags.push('Gluten-free');
    }

    if (this.tags.soyFree) {
      recipe.tags.push('Soy-free');
    }

    if (this.tags.vegan) {
      recipe.tags.push('Vegan');
    }
  }

  private checkLipidTags(recipe: Recipe): void {
    let energy: number = recipe.nutrition.Energy,
      reqEnergy: number = (recipe.category === 'Breakfasts') ? 900 : 450,
      reqFat: number = energy * 0.35 / 9,
      reqSatFat: number = energy * 0.1 / 9;

    if (recipe.nutrition.Fats > reqFat) {
      recipe.tags.push('High-fat (good)');
    } else if (recipe.nutrition.Fats <= reqFat / 2) {
      recipe.tags.push('Low-fat (bad)');
    }

    if (recipe.nutrition['Saturated fat'] > reqSatFat) {
      recipe.tags.push('High-fat (bad)');
    } else if (recipe.nutrition['Saturated fat'] <= reqSatFat / 2) {
      recipe.tags.push('Low-fat (good)');
    }
  }

  private checkLipidLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200 || recipe.cookMethod === 'Boiling') {
      recipe.nutrition.Fats -= recipe.nutrition.Fats * 0.15;
      recipe.nutrition['Monounsaturated fat'] -= recipe.nutrition['Monounsaturated fat'] * 0.15;
      recipe.nutrition['Polyunsaturated fat'] -= recipe.nutrition['Polyunsaturated fat'] * 0.15;
      recipe.nutrition['Saturated fat'] -= recipe.nutrition['Saturated fat'] * 0.15;
      recipe.nutrition['Trans fat'] -= recipe.nutrition['Trans fat'] * 0.15;
    }
    if (recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching') {
      recipe.nutrition.Fats -= recipe.nutrition.Fats * 0.5;
      recipe.nutrition['Monounsaturated fat'] -= recipe.nutrition['Monounsaturated fat'] * 0.5;
      recipe.nutrition['Polyunsaturated fat'] -= recipe.nutrition['Polyunsaturated fat'] * 0.5;
      recipe.nutrition['Saturated fat'] -= recipe.nutrition['Saturated fat'] * 0.5;
      recipe.nutrition['Trans fat'] -= recipe.nutrition['Trans fat'] * 0.5;
    }
  }

  private checkMineralLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200 || recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching'  || recipe.cookMethod === 'Boiling') {
      for (let mineral in recipe.nutrition['minerals']) {
        recipe.nutrition['minerals'][mineral] -= recipe.nutrition['minerals'][mineral] * 0.6;
      }
    } else if (recipe.cookTemperature >= 100) {
      for (let mineral in recipe.nutrition['minerals']) {
        recipe.nutrition['minerals'][mineral] -= recipe.nutrition['minerals'][mineral] * 0.4;
      }
    }
  }

  private checkNutrientLoss(recipe: Recipe): void {
    this.checkCarbLoss(recipe);
    this.checkLipidLoss(recipe);
    this.checkMineralLoss(recipe);
    this.checkProteinLoss(recipe);
    this.checkVitaminLoss(recipe);
  }

  private checkProteinLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200  || recipe.cookMethod === 'Boiling') {
      recipe.nutrition.Protein -= recipe.nutrition.Protein * 0.15;
      for (let aa in recipe.nutrition['amino acids']) {
        recipe.nutrition['amino acids'][aa] -= recipe.nutrition['amino acids'][aa] * 0.15;
      }
    }
    if (recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching') {
      recipe.nutrition.Protein -= recipe.nutrition.Protein * 0.5;
      for (let aa in recipe.nutrition['amino acids']) {
        recipe.nutrition['amino acids'][aa] -= recipe.nutrition['amino acids'][aa] * 0.5;
      }
    }
  }

  private checkProteinTags(recipe: Recipe): void {
    let energy: number = recipe.nutrition.Energy,
      reqEnergy: number = (recipe.category === 'Breakfasts') ? 900 : 450,
      reqProtein: number = energy * 0.2 / 4.1;

    if (recipe.nutrition.Protein > reqProtein) {
      recipe.tags.push('High-protein');
    } else if (recipe.nutrition.Protein <= reqProtein / 2) {
      recipe.tags.push('Low-protein');
    }
  }

  private checkVitaminLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200 || recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching'  || recipe.cookMethod === 'Boiling') {
      for (let vitamin in recipe.nutrition['vitamins']) {
        recipe.nutrition['vitamins'][vitamin] -= recipe.nutrition['vitamins'][vitamin] * 0.75;
      }
    } else if (recipe.cookTemperature >= 100) {
      for (let vitamin in recipe.nutrition['vitamins']) {
        recipe.nutrition['vitamins'][vitamin] -= recipe.nutrition['vitamins'][vitamin] * 0.5;
      }
    }
  }

  private portionRecipe(recipe: Recipe): void {
    for (let nutrientCategory in recipe.nutrition) {
      let nutrients = recipe.nutrition[nutrientCategory];
      if (typeof nutrients === 'number') {
        recipe.nutrition[nutrientCategory] /= +recipe.servings;
      } else if (typeof nutrients === 'object') {
        for (let nutrient in nutrients) {
          recipe.nutrition[nutrientCategory][nutrient] /= +recipe.servings;
        }
      }
    }
    recipe.quantity = Math.floor(recipe.quantity / +recipe.servings);
  }

  private setRemainingNutrition(recipe: Recipe, requiredNutrition: Nutrition): void {
    for (let nutrientCategory in requiredNutrition) {
      let reqNutrients = requiredNutrition[nutrientCategory],
        totalNutrients = recipe.nutrition[nutrientCategory];
      if (typeof reqNutrients === 'number') {
        if (!!reqNutrients) {
          recipe.nutrition[nutrientCategory] = Math.floor((totalNutrients / reqNutrients) * 100);
        } else {
          recipe.nutrition[nutrientCategory] = !!totalNutrients ? 100 : 100 + totalNutrients;
        }
      }
      for (let nutrient in reqNutrients) {
        if (reqNutrients[nutrient] > 0) {
          recipe.nutrition[nutrientCategory][nutrient] = Math.floor((totalNutrients[nutrient] / reqNutrients[nutrient]) * 100);
        } else {
          recipe.nutrition[nutrientCategory][nutrient] = !!totalNutrients[nutrient] ? 100 : 100 + totalNutrients[nutrient];
        }
      }
    }
  }

  public filterRecipes(recipes: Recipe[], query: string, searchTerm: string, ingredients: string[]): Recipe[] {
    return recipes.filter((recipe: Recipe) => {
      let match: boolean = false,
        matchedIngredients: number = 0;
      if (recipe[query].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        match = true;
        if (!!ingredients && !!ingredients.length) {
          ingredients.forEach((item: string) => {
            recipe.ingredients.forEach((ingredient: Ingredient) => {
              if (ingredient.name === item) {
                matchedIngredients++;
              }
            });
          });
          if (matchedIngredients !== ingredients.length) {
            match = false;
          }
        }
      }
      return match;
    });
  }

  public setRecipeNutrition(recipe: Recipe): void {
    recipe.nutrition = new Nutrition();
    recipe.quantity = 0;
    // Set total recipe nutrition and quantity in grams
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.category === 'Grains') {
        this.tags.glutenFree = false;
      } else if (ingredient.category === 'Meat') {
        this.tags.vegan = false;
      } else if (ingredient.category === 'Dairy') {
        this.tags.dairyFree = false;
      }
      if (ingredient.name.toLowerCase().indexOf('soy') !== -1) {
        this.tags.soyFree = false;
      }
      recipe.quantity += ingredient.quantity;
      if (ingredient.hasOwnProperty('nutrition')) {
        // The ingredient is a recipe
        for (let nutrientCategory in ingredient.nutrition) {
          let nutrients = ingredient.nutrition[nutrientCategory];
          if (typeof nutrients === 'number') {
            recipe.nutrition[nutrientCategory] += nutrients * ingredient.quantity;
          } else if (typeof nutrients === 'object') {
            for (let nutrient in nutrients) {
              recipe.nutrition[nutrientCategory][nutrient] += nutrients[nutrient] * ingredient.quantity;
            }
          }
        }
      } else {
        // The ingredient is a basic food
        for (let nutrientCategory in ingredient) {
          let nutrients = ingredient[nutrientCategory];
          if (typeof nutrients === 'number' && nutrientCategory !== 'quantity') {
            recipe.nutrition[nutrientCategory] += nutrients * (ingredient.quantity / 100);
          } else if (typeof nutrients === 'object') {
            for (let nutrient in nutrients) {
              recipe.nutrition[nutrientCategory][nutrient] += nutrients[nutrient] * (ingredient.quantity / 100);
            }
          }
        }
      }
    });

    this.checkNutrientLoss(recipe);
    this.portionRecipe(recipe);
    this.checkHealthTags(recipe);
  }

}