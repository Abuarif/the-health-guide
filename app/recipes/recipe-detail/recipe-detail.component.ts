// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// THG
import { Recipe } from '../shared/recipe.model';

@Component({
    moduleId: module.id,
    selector: 'thg-recipe-detail',
    templateUrl: 'recipe-detail.component.html',
    styleUrls: ['recipe-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDetailComponent implements OnInit {
    public recipe: Recipe;
    public aminoacids: string[] = [];
    public basicNutrients: string[] = [];
    public minerals: string[] = [];
    public vitamins: string[] = [];
    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _route: ActivatedRoute,
        private _router: RouterExtensions
    ) {
        this.basicNutrients = [
            'Water',
            'Protein',
            'Carbohydrates',
            'Sugars',
            'Fiber',
            'Fats',
            'Saturated fat',
            'Monounsaturated fat',
            'Polyunsaturated fat',
            'Omega-3 fatty acids',
            'Omega-6 fatty acids',
            'Trans fat'
        ];
    }

    public goBack(): void {
        this._router.back();
    }

    ngOnInit(): void {
        this._route.data.subscribe((data: { recipe: Recipe }) => {
            this.recipe = data.recipe;
            console.log(this.recipe);
            this.aminoacids = Object.keys(this.recipe.nutrition['amino acids']);
            this.vitamins = Object.keys(this.recipe.nutrition['vitamins']);
            this.minerals = Object.keys(this.recipe.nutrition['minerals']);
            this._changeDetectionRef.detectChanges();
        });
    }

}
