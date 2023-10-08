import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DEFAULT_IMAGE_URL, ICartEntry, IItem, PaymentMethod} from "@models/pos";
import {CartService} from "@services/cart.service";
import {StockService} from "@services/stock.service";
import {MatDialog} from "@angular/material/dialog";
import {
    CustomizeItemDialogComponent,
    ICustomizeItemDialogInput
} from "../customize-item-dialog/customize-item-dialog.component";
import {PurchaseDialogComponent} from "../purchase-dialog/purchase-dialog.component";

interface IDiscountResult
{
    readonly used: ICartEntry[],
    readonly count: number;
}

@Component({
    selector: 'cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit
{
    public cart: ICartEntry[] = [];

    constructor(private http: HttpClient,
                private dialog: MatDialog,
                private stockService: StockService,
                private cartService: CartService)
    {
    }

    ngOnInit(): void
    {
        this.cartService.cart.subscribe(x => this.cart = x);
    }

    onEmptyCart()
    {
        this.cartService.emptyCart();
    }

    get isEmpty()
    {
        return this.cart.length === 0;
    }

    get total()
    {
        return this.cartService.total;
    }

    getItemImage(item: IItem)
    {
        return item.image ?? DEFAULT_IMAGE_URL;
    }

    trackByFn = (index: number) => index;

    removeEntry(e: MouseEvent, i: number)
    {
        e.stopPropagation();
        this.cartService.removeEntry(i);
    }

    canCustomize(entry: ICartEntry)
    {
        return entry.item.created_in_the_kitchen;
    }

    onCustomizeEntry(entry: ICartEntry, index: number)
    {
        const item = entry.item
        if(item == undefined || !item.created_in_the_kitchen)
        {
            return;
        }

        const dialogRef = this.dialog
            .open<CustomizeItemDialogComponent, ICustomizeItemDialogInput, ICartEntry>(
                CustomizeItemDialogComponent,
                {
                    width: '600px',
                    data: {
                        entry: entry,
                        isEdit: true
                    },
                    disableClose: true
                });

        dialogRef.afterClosed().subscribe(result => {
            if(result)
            {
                this.cartService.updateCartEntry(result, index);
            }
        });
    }

    onPurchase()
    {
        this.addDiscounts();
        const dialogRef = this.dialog
            .open<PurchaseDialogComponent>(
                PurchaseDialogComponent,
                {
                    width: '600px',
                    height: '300px',
                    disableClose: true
                });

        dialogRef.afterClosed().subscribe(() => {
            this.removeDiscounts();
        });
    }

    private removeDiscounts()
    {
        while (true)
        {
            const index = this.cart.findIndex(x => x.discount === true);
            if(index === -1)
            {
                break;
            }
            this.cartService.removeEntry(index);
        }
    }

    private addDiscounts()
    {
        //TODO: This client currently only supports credit as payment type
        const discounts = this.stockService.discounts().filter(x => x.payment_method == PaymentMethod.Credit);
        let cartItems = [...this.cart];
        for(const discount of discounts)
        {
            const item = this.stockService.resolveItemId(discount.item)!;
            const func = eval(discount.expression) as (cart: ICartEntry[]) => IDiscountResult;
            const result = func(cartItems);
            for(const item of result.used)
            {
                const index = cartItems.indexOf(item);
                cartItems = [
                    ...cartItems.slice(0, index),
                    ...cartItems.slice(index + 1)
                ];
            }
            for (let i = 0; i < result.count; i++)
            {
                this.cartService.addToCart({
                    discount: true,
                    item: item,
                    price: item.price,
                    ingredients: []
                });
            }
        }
    }
}
