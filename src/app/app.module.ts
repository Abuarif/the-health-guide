import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { IonicApp, IonicModule } from 'ionic-angular';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { ChartsModule } from "ng2-charts/ng2-charts";
import { Ng2MaterialModule } from "ng2-material";

// App
import { HealthGuideApp } from './app.component';

// Components
import { NutritionTable } from '../components';

// Pages
import {
  ActivityJournalPage,
  AuthPage,
  FoodListPage,
  FitnessPage,
  HomePage,
  MealSearchPage,
  JournalPage,
  MealJournalPage,
  MjDetailsPage,
  NutrientDetailsPage,
  NutrientListPage,
  RecipeDetailsPage,
  RecipeEditPage,
  RecipeListPage
} from '../pages';

// Pipes
import { Limit, SearchFilter } from "../pipes";

// Providers
import {
  ActivityService,
  FitnessService,
  MealService,
  NutritionService,
  RecipeService
} from "../providers";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBXdSjoVfk1KbbtmAUEq7ktnnI70ojg4y8",
  authDomain: "the-health-guide.firebaseapp.com",
  databaseURL: "https://the-health-guide.firebaseio.com",
  storageBucket: "the-health-guide.appspot.com",
  messagingSenderId: "283336744173"
};

const FIREBASE_AUTH_CONFIG = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    ActivityJournalPage,
    AuthPage,
    FitnessPage,
    FoodListPage,
    HealthGuideApp,
    HomePage,
    MealSearchPage,
    JournalPage,
    Limit,
    MealJournalPage,
    MjDetailsPage,
    NutrientDetailsPage,
    NutrientListPage,
    NutritionTable,
    RecipeDetailsPage,
    RecipeEditPage,
    RecipeListPage,
    SearchFilter
  ],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG, FIREBASE_AUTH_CONFIG),
    ChartsModule,
    FormsModule,
    IonicModule.forRoot(HealthGuideApp),
    Ng2MaterialModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ActivityJournalPage,
    AuthPage,
    FitnessPage,
    FoodListPage,
    HealthGuideApp,
    HomePage,
    MealSearchPage,
    JournalPage,
    MealJournalPage,
    MjDetailsPage,
    NutrientDetailsPage,
    NutrientListPage,
    NutritionTable,
    RecipeDetailsPage,
    RecipeEditPage,
    RecipeListPage
  ],
  providers: [
    ActivityService,
    FitnessService,
    MealService,
    NutritionService,
    RecipeService
  ]
})
export class AppModule { }
