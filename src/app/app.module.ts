import {NgModule, provideZonelessChangeDetection} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {ItemGridComponent} from './item-grid/item-grid.component';
import {MaterialElevationDirective} from './material-elevation.directive';
import {CartComponent} from './cart/cart.component';
import {MatRippleModule} from "@angular/material/core";
import {CategoriesComponent} from './categories/categories.component';
import {AuthorizationInterceptor} from "./authorization.interceptor";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {CustomizeItemDialogComponent} from './customize-item-dialog/customize-item-dialog.component';
import {CreditCheckDialogComponent} from "./credit-check-dialog/credit-check-dialog.component";
import {PurchaseDialogComponent} from "./purchase-dialog/purchase-dialog.component";
import {LoginDialogComponent} from "./login-dialog/login-dialog.component";
import { PreviousOrderDialog } from './previous-order-dialog/previous-order-dialog.component';
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatRadioModule} from "@angular/material/radio";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatCheckbox} from "@angular/material/checkbox";

@NgModule({
    declarations: [
        AppComponent,
        ItemGridComponent,
        MaterialElevationDirective,
        CartComponent,
        CategoriesComponent,
        CustomizeItemDialogComponent,
        CreditCheckDialogComponent,
        PurchaseDialogComponent,
        LoginDialogComponent,
        PreviousOrderDialog
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatListModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatCardModule,
        MatRippleModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatRadioModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatProgressSpinner,
        MatCheckbox
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthorizationInterceptor,
            multi: true
        },
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: {
                duration: 5000,
                verticalPosition: "top",
                horizontalPosition: "end"
            } as MatSnackBarConfig
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()
    ]
})
export class AppModule
{
    constructor(iconRegistry: MatIconRegistry) {
        iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    }

}
