// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import * as application from 'application';
import { ListViewEventData, RadListView } from 'nativescript-telerik-ui/listview';
import { setTimeout } from 'timer';

// THG
import { AuthService } from '../../auth';
import { DrawerService, HelperService } from '../../shared';
import { MealSearchComponent } from '../../meal-search';
import { MealSearchService } from '../../meal-search/meal-search.service'
import { Ingredient, Recipe } from '../shared/recipe.model';
import { RecipeDataService } from '../shared/recipe-data.service';
import { RecipeService } from '../shared/recipe.service';

@Component({
  moduleId: module.id,
  selector: 'thg-recipes',
  templateUrl: 'recipe-list.component.html',
  styleUrls: ['recipe-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeListComponent implements OnInit {
  private _privateLimit: number = 5;
  private _privateRecipes: Recipe[];
  private _sharedLimit: number = 10;
  private _sharedRecipes: Recipe[];
  public filteredPrivate: Recipe[];
  public filteredShared: Recipe[];
  public gridView: boolean = false;
  public ingredients: string[];
  public isLoadingPrivate: boolean = true;
  public isLoadingShared: boolean = true;
  public isSearching: boolean = false;
  public listView: boolean = true;
  public query: string = 'name';
  public queryIngredients: Ingredient[] = [];
  public searchInputPrivate: string = '';
  public searchInputShared: string = '';
  constructor(
    private _authSvc: AuthService,
    private _changeDetectionRef: ChangeDetectorRef,
    private _helperSvc: HelperService,
    private _mealSearchSvc: MealSearchService,
    private _recipeDataSvc: RecipeDataService,
    private _recipeSvc: RecipeService,
    private _router: RouterExtensions,
    public drawerSvc: DrawerService
  ) { }

  private _editRecipe(args: ListViewEventData): void {
    let listview = args.object as RadListView,
      recipe: Recipe = listview.getSelectedItems()[0];
    this._recipeDataSvc.storeRecipe(recipe);
    setTimeout(() => this._router.navigate(['/recipes', this._authSvc.getAuth().id, recipe.$key]), 1000);
  }

  public changeQuery(): void {
    dialogs.action({
      title: 'Filter type',
      message: 'Choose the search filter',
      cancelButtonText: 'Cancel',
      actions: ['Recipe name', 'Chef', 'Ingredients']
    }).then((result: string) => {
      switch (result) {
        case 'Recipe name':
          this.query = 'name';
          break;
        case 'Chef':
          this.query = 'chef';
          break;
        case 'Ingredients':
          this.query = 'ingredients';
          this._router.navigate(['/meal-search']);
          break;

        default:
          this.query = 'name';
          break;
      }
    });
  }

  public changeView(viewType: string): void {
    if (viewType === 'grid') {
      this.listView = false;
      this.gridView = true;
    } else if (viewType === 'list') {
      this.gridView = false;
      this.listView = true;
    }
  }

  public clearSearchPrivate(): void {
    this.searchInputPrivate = '';
    this.filteredPrivate = [...this._sharedRecipes.slice(0, this._sharedLimit)];
  }

  public clearSearchShared(): void {
    this.searchInputShared = '';
    this.filteredShared = [...this._sharedRecipes.slice(0, this._sharedLimit)];
  }

  public loadMorePrivate(args: ListViewEventData): void {
    this._sharedLimit += 5;
    this.filteredPrivate = [...this._sharedRecipes.slice(0, this._sharedLimit)];
    args.object.notifyLoadOnDemandFinished();
    args.returnValue = true;
    if (this.filteredPrivate.length > 5) {
      setTimeout(() => args.object.scrollToIndex(this.filteredPrivate.length - 5), 1000);
    }
  }

  public loadMoreShared(args: ListViewEventData): void {
    this._sharedLimit += 10;
    this.filteredShared = [...this._sharedRecipes.slice(0, this._sharedLimit)];
    args.object.notifyLoadOnDemandFinished();
    args.returnValue = true;
    if (this.filteredShared.length > 10) {
      setTimeout(() => args.object.scrollToIndex(this.filteredShared.length - 10), 1000);
    }
  }

  public openDetails(args: ListViewEventData): void {
    let listview = args.object as RadListView,
      recipe: Recipe = listview.getSelectedItems()[0];
    this._recipeDataSvc.storeRecipe(recipe);
    setTimeout(() => this._router.navigate(['/recipes', recipe.$key]), 1000);
  }

  public refreshPrivate(args?: ListViewEventData, withFetch?: boolean): void {
    this._privateRecipes = [];
    this._recipeDataSvc.getPrivateRecipes(withFetch).subscribe((data: Recipe) => this._privateRecipes.push(data));
    setTimeout(() => {
      this.filteredPrivate = [...this._privateRecipes.slice(0, this._privateLimit)];
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.isLoadingPrivate = false;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    }, 3000);
  }

  public refreshShared(args?: ListViewEventData, withFetch?: boolean): void {
    this._sharedRecipes = [];
    this._recipeDataSvc.getSharedRecipes(withFetch).subscribe((data: Recipe) => this._sharedRecipes.push(data));
    setTimeout(() => {
      this.filteredShared = [...this._sharedRecipes.slice(0, this._sharedLimit)];
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.isLoadingShared = false;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    }, 3000);
  }

  public searchPrivate(searchTerm: string): void {
    this.filteredPrivate = [...this._recipeSvc.filterRecipes(this._privateRecipes, this.query, searchTerm, this.queryIngredients).slice(0, this._privateLimit)];
  }

  public searchShared(searchTerm: string): void {
    this.filteredShared = [...this._recipeSvc.filterRecipes(this._sharedRecipes, this.query, searchTerm, this.queryIngredients).slice(0, this._sharedLimit)];
  }

  public showOptions(args: ListViewEventData): void {
    let
      options = {
        title: 'Recipe options',
        message: 'Choose what to do with your recipe',
        cancelButtonText: 'Cancel',
        actions: ['View details', 'Edit recipe', 'Delete recipe']
      };
    dialogs.action(options).then((result: string) => {
      switch (result) {
        case 'View details':
          this.openDetails(args);
          break;
        case 'Edit recipe':
          this._editRecipe(args);
          break;

        default:
          break;
      }
    });
  }

  public toggleSearching(): void {
    this.isSearching = !this.isSearching;
  }

  ngOnInit(): void {
    this.refreshPrivate();
    this.refreshShared();
  }
}