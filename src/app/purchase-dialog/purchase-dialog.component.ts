import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ICreditCheck, IOrder, IPurchaseInput, PaymentMethod} from "@models/pos";
import {CartService} from "@services/cart.service";
import {StockService} from "@services/stock.service";
import {Observable, Subscription} from "rxjs";
import {map} from 'rxjs/operators';
import {ConfigService} from "@services/config.service";
import {MatInput} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

type PurchaseState = "INITIAL" | "IN_PROGRESS" | "COMPLETE" | "FAILED";

@Component({
    selector: 'purchase-dialog',
    templateUrl: './purchase-dialog.component.html',
    styleUrls: ['./purchase-dialog.component.scss'],
    standalone: false
})
export class PurchaseDialogComponent implements OnDestroy, AfterViewInit {
    private closeSubscription: Subscription | undefined = undefined;

    badge: string = "";
    state: PurchaseState = "INITIAL";
    orderId?: number = undefined;

    @ViewChild(MatInput)
    private badgeInput: MatInput | undefined = undefined;

    constructor(public dialogRef: MatDialogRef<PurchaseDialogComponent>,
                private changeDetector: ChangeDetectorRef,
                private config: ConfigService,
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

    private verifyCredit(badge: string): Observable<[valid: boolean, is_crew: boolean]>
    {
        return this.http
            .get<ICreditCheck>(`${this.config.baseUrl}/credit/${badge}`)
            .pipe(map(result => [result.left > this.cartService.total, result.is_crew]));
    }

    onPurchaseCredit()
    {
        if(!this.badge)
        {
            this.badgeInput?.focus();
            return;
        }

        this.state = "IN_PROGRESS";
        this.changeDetector.detectChanges();
        this.verifyCredit(this.badge)
            .subscribe({
                next: success => {
                    if(!success[0])
                    {
                        this.snackbar.open("Not enough credit left on card", "Close");
                        this.state = "FAILED";

                        setTimeout(() => this.badgeInput?.focus());
                        this.changeDetector.detectChanges();
                        return;
                    }

                    this.onPurchase(success[1] ? PaymentMethod.Credit : PaymentMethod.Prepaid);
                },
                error: () => {
                    this.snackbar.open("Failed to check user credit", "Close");
                    this.state = "FAILED";

                    setTimeout(() => this.badgeInput?.focus());
                    this.changeDetector.detectChanges();
                }
            });
    }

    public onPurchaseCard()
    {
        this.state = "IN_PROGRESS";
        this.changeDetector.detectChanges();
        this.onPurchase(PaymentMethod.Card);
    }

    private onPurchase(method: PaymentMethod)
    {
        const cashier = this.stockService.currentCashier;
        if(!cashier || !cashier.card)
        {
            this.cartService.emptyCart();
            this.onCancel();
            return;
        }
        const cart = this.cartService.cartValue;
        const input: IPurchaseInput = {
            card: method === PaymentMethod.Card ? undefined : this.badge,
            cashier_card: cashier.card,
            payment_method: method,
            undo: false,
            message: "",
            lines: cart.map(x => ({
                item: x.item.id,
                message: x.message,
                ingredients: x.ingredients
            }))
        };
        this.badge = "";
        this.http
            .post<IOrder>(`${this.config.baseUrl}/purchases/?format=json`, input)
            .subscribe({
                next: order => {
                    this.orderId = order.id;
                    this.state = "COMPLETE";
                    this.cartService.emptyCart();

                    window.localStorage.setItem("previous-order", JSON.stringify(order))
                    const timeout = setTimeout(() => this.dialogRef.close(true), 5000);
                    this.closeSubscription = this.dialogRef
                        .afterClosed()
                        .subscribe(() => clearTimeout(timeout));
                    this.changeDetector.detectChanges();
                },
                error: (e: HttpErrorResponse) => {
                    const message = e.error.detail as string;
                    this.state = "FAILED";
                    this.snackbar.open(message, "Close");

                    setTimeout(() => this.badgeInput?.focus());
                    this.changeDetector.detectChanges();
                }
            });
    }

    ngAfterViewInit()
    {
        this.badgeInput?.stateChanges.subscribe(() => {
            if(!this.badgeInput?.focused)
            {
                this.badgeInput?.focus();
            }
        });
    }

    ngOnDestroy(): void
    {
        this.closeSubscription?.unsubscribe();
    }
}
