// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import { ListPicker } from 'ui/list-picker';
import { setTimeout } from 'timer';

// THG
import { HelperService } from '../../shared';
import { Ingredient, Recipe } from '../shared/recipe.model';
import { RecipeDataService } from '../shared/recipe-data.service';
import { RecipeService } from '../shared/recipe.service';

@Component({
    moduleId: module.id,
    selector: 'thg-recipe-edit',
    templateUrl: 'recipe-edit.component.html',
    styleUrls: ['recipe-edit.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeEditComponent implements OnInit {
    private _foods: Ingredient[] = [];
    private _isDirty: boolean = false;
    private _recipes: Ingredient[] = [];
    public aminoacids: string[] = [];
    public basicNutrition: string[] = [];
    public categories: string[];
    public cookMethods: string[];
    public difficulties: string[];
    public filteredIngredients: Ingredient[] = [];
    public filteredTotal: number = 0;
    public ingredients: Ingredient[] = [];
    public instructions: string[] = [];
    public minerals: string[] = [];
    public recipe: Recipe;
    public recipeTabIdx: number = 0;
    public recipeForm: FormGroup;
    public selectedCategory: number;
    public selectedCookMethod: number = 0;
    public selectedDifficulty: number;
    public vitamins: string[] = [];
    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private _helperSvc: HelperService,
        private _recipeSvc: RecipeService,
        private _recipeDataSvc: RecipeDataService,
        private _router: RouterExtensions
    ) {
        this.basicNutrition = [
            'Energy',
            'Water',
            'Protein',
            'Carbohydrates',
            'Sugars',
            'Fiber',
            'Fats',
            'Saturated fat',
            'Monounsaturated fat',
            'Polyunsaturated fat',
            'Trans fat'
        ];

        this.categories = [
            'Appetizers',
            'Beverages',
            'Breakfasts',
            'Casserolles',
            'Desserts',
            'Holidays',
            'Main dishes',
            'Salads',
            'Sandwiches',
            'Sauces',
            'Side dishes',
            'Soups'
        ];

        this.cookMethods = [
            'Baking',
            'Blanching',
            'Boiling',
            'Braising',
            'Freezing',
            'Frying',
            'Grilling',
            'Microwaving',
            'Pasteurization',
            'Pickling',
            'Poaching',
            'Raw',
            'Sauteing',
            'Simmering',
            'Slow cooking',
            'Smoking',
            'Steaming'
        ];

        this.difficulties = [
            'Easy',
            'Intermidiate',
            'Advanced',
            'Master chef'
        ];
    }

    public addInstruction(): void {
        this.recipe.instructions.push('');
        this._isDirty = true;
    }

    public canDeactivate(): Promise<boolean> | boolean {
        if (this._isDirty === false || (!this.recipeForm.dirty && this.recipe.ingredients.length === 0 && this.recipe.instructions.length === 0 && this.recipe.image === '')) {
            return true;
        }
        return new Promise(resolve => {
            dialogs.confirm({
                title: "Race selection",
                message: 'Changes have been made! Are you sure you want to leave?',
                okButtonText: 'Agree',
                cancelButtonText: 'Disagree'
            }).then((result: boolean) => {
                resolve(result);
            });
        });
    }

    public changeCategory(picker: ListPicker) {
        this.selectedCategory = picker.selectedIndex;
        this.recipe.category = this.categories[this.selectedCategory];
        this._isDirty = true;
    }

    public changeCookMethod(picker: ListPicker) {
        this.selectedCookMethod = picker.selectedIndex;
        this.recipe.cookMethod = this.cookMethods[this.selectedCookMethod];
        this._isDirty = true;
    }

    public changeDifficulty(picker: ListPicker) {
        this.selectedDifficulty = picker.selectedIndex;
        this.recipe.difficulty = this.difficulties[this.selectedDifficulty];
        this._isDirty = true;
    }

    public goBack(): void {
        this._router.back();
    }

    public removeIngredient(index: number): void {
        this.recipe.ingredients.splice(index, 1);
        this.syncNutrition();
        this._isDirty = true;
    }

    public removeInstruction(index: number) {
        this.instructions.splice(index, 1);
        this.recipe.instructions = [...this.instructions];
        this._isDirty = true;
    }

    public syncNutrition(): void {
        this._recipeSvc.setRecipeNutrition(this.recipe);
    }

    ngOnInit(): void {
        this.recipe = this._recipeDataSvc.getRecipe();
        this.aminoacids = Object.keys(this.recipe.nutrition['amino acids']);
        this.vitamins = Object.keys(this.recipe.nutrition['vitamins']);
        this.minerals = Object.keys(this.recipe.nutrition['minerals']);
        this.recipeForm = this._fb.group({
            name: [this.recipe.name, [Validators.required, Validators.maxLength(20)]],
            description: [this.recipe.description, [Validators.required, Validators.maxLength(100)]],
            cookTemperature: [this.recipe.cookTemperature, [Validators.required]],
            duration: [this.recipe.duration, [Validators.required, Validators.maxLength(3)]],
            servings: [this.recipe.servings, [Validators.required, Validators.maxLength(3)]],
            difficulty: [this.recipe.difficulty, [Validators.required]],
            cookMethod: [this.recipe.cookMethod, [Validators.required]],
            category: [this.recipe.category, [Validators.required]]
        });
        this._changeDetectionRef.detectChanges();
    }

}
