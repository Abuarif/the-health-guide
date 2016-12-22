import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from '../../app-routing.module';
import { AuthComponent } from '../../auth/auth.component';
import { AuthGuard } from '../../auth/auth-guard.service';
import { AuthService } from '../../auth/auth.service';
import { HomeComponent } from '../../home/home.component';

export const thgDeclarations = [
    AuthComponent,
    HomeComponent
];

export const thgEntries = [
];

export const thgImports = [
    NativeScriptFormsModule,
    NativeScriptModule,
    ReactiveFormsModule,
    AppRoutingModule
];

export const thgProviders = [
    AuthGuard,
    AuthService
];