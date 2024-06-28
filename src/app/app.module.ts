import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ItemGridComponent} from './item-grid/item-grid.component';
import {MatCardModule} from "@angular/material/card";
import {MaterialElevationDirective} from './material-elevation.directive';
import {ItemGridEntryComponent} from './item-grid-entry/item-grid-entry.component';
import {CartComponent} from './cart/cart.component';
import {MatRippleModule} from "@angular/material/core";
import {CategoriesComponent} from './categories/categories.component';
import {AuthorizationInterceptor} from "./authorization.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CustomizeItemDialogComponent} from './customize-item-dialog/customize-item-dialog.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatRadioModule} from "@angular/material/radio";
import {CreditCheckDialogComponent} from "./credit-check-dialog/credit-check-dialog.component";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {PurchaseDialogComponent} from "./purchase-dialog/purchase-dialog.component";
import {LoginDialogComponent} from "./login-dialog/login-dialog.component";
import { PreviousOrderDialog } from './previous-order-dialog/previous-order-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        ItemGridComponent,
        MaterialElevationDirective,
        ItemGridEntryComponent,
        CartComponent,
        CategoriesComponent,
        CustomizeItemDialogComponent,
        CreditCheckDialogComponent,
        PurchaseDialogComponent,
        LoginDialogComponent,
        PreviousOrderDialog
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
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
        MatTooltipModule
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
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule
{
}
