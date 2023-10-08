import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BASE_URL, IOrder, IPurchaseInput, PaymentMethod} from "@models/pos";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'previous-order-dialog',
  templateUrl: './previous-order-dialog.component.html',
  styleUrls: ['./previous-order-dialog.component.scss']
})
export class PreviousOrderDialog implements OnInit {

    constructor(public dialogRef: MatDialogRef<PreviousOrderDialog>,
                private http: HttpClient,
                private snackbar: MatSnackBar)
    {
        const orderString = window.localStorage.getItem("previous-order")!;
        this.order = JSON.parse(orderString) as IOrder;
    }

    public order: IOrder;

    ngOnInit(): void
    {
    }

    onCancel()
    {
        this.dialogRef.close();
    }

    onUndoOrder()
    {
        const input: IPurchaseInput = {
            card: this.order.card,
            cashier_card: this.order.cashier_card,
            payment_method: PaymentMethod.Credit,
            undo: true,
            message: "",
            lines: this.order.lines.map(x => ({
                item: x.item.id,
                ingredients: x.ingredients.map(x => x.id)
            }))
        };
        this.http
            .post<IOrder>(`${BASE_URL}/purchases/?format=json`, input)
            .subscribe(order => {
                this.snackbar.open("The last order has been undone", "Close");
                window.localStorage.removeItem("previous-order");
                this.onCancel();
            }, (e: HttpErrorResponse) => {
                const message = e.error.detail as string;
                this.snackbar.open(message, "Close");
            });
    }
}
