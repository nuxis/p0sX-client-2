import {Component, OnDestroy, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BASE_URL, IOrder, IPurchaseInput, PaymentMethod} from "@models/pos";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CartService} from "@services/cart.service";
import {StockService} from "@services/stock.service";
import {MatInput} from "@angular/material/input";
import {Subscription} from "rxjs";

@Component({
  selector: 'purchase-dialog',
  templateUrl: './purchase-dialog.component.html',
  styleUrls: ['./purchase-dialog.component.scss']
})
export class PurchaseDialogComponent implements OnDestroy{
    private closeSubscription: Subscription | undefined = undefined;

    badge: string = "";
    purchaseCompleted: boolean = false;
    purchaseInProgress: boolean = false;
    orderId?: number = undefined;

    @ViewChild(MatInput)
    private badgeInput: MatInput | undefined = undefined;

    constructor(public dialogRef: MatDialogRef<PurchaseDialogComponent>,
                private cartService: CartService,
                private stockService: StockService,
                private http: HttpClient,
                private snackbar: MatSnackBar) {}

    get total()
    {
        return this.cartService.total;
    }

    onCancel()
    {
        this.dialogRef.close();
    }

    onPurchase()
    {
        const cashier = this.stockService.currentCashier;
        if(!cashier || !cashier.card)
        {
            this.cartService.emptyCart();
            this.onCancel();
            return;
        }

        if(!this.badge)
        {
            this.badgeInput?.focus();
            return;
        }

        const cart = this.cartService.cartValue;
        const input: IPurchaseInput = {
            card: this.badge,
            cashier_card: cashier.card,
            payment_method: PaymentMethod.Credit,
            undo: false,
            message: "",
            lines: cart.map(x => ({
                item: x.item.id,
                message: x.message,
                ingredients: x.ingredients
            }))
        };
        this.badge = "";
        this.purchaseInProgress = true;
        this.http
            .post<IOrder>(`${BASE_URL}/purchases/?format=json`, input)
            .subscribe(order => {
                this.orderId = order.id;
                this.purchaseCompleted = true;
                this.cartService.emptyCart();
                this.purchaseInProgress = false;

                window.localStorage.setItem("previous-order", JSON.stringify(order))
                const timeout = setTimeout(() => this.dialogRef.close(true), 5000);
                this.closeSubscription = this.dialogRef
                    .afterClosed()
                    .subscribe(() => clearTimeout(timeout));
            }, (e: HttpErrorResponse) => {
                const message = e.error.detail as string;
                this.purchaseInProgress = false;
                this.snackbar.open(message, "Close");

                setTimeout(() => this.badgeInput?.focus());
            });
    }

    ngOnDestroy(): void
    {
        this.closeSubscription?.unsubscribe();
    }
}
