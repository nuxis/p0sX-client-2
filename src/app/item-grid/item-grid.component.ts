import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ICartEntry, IItem} from '@models/pos';
import {MatDialog} from "@angular/material/dialog";
import {CartService} from "@services/cart.service";
import {StockService} from "@services/stock.service";
import {
    CustomizeItemDialogComponent,
    ICustomizeItemDialogInput
} from "../customize-item-dialog/customize-item-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'item-grid',
    templateUrl: './item-grid.component.html',
    styleUrls: ['./item-grid.component.scss']
})
export class ItemGridComponent
{
    constructor(private http: HttpClient,
                private dialog: MatDialog,
                private stockService: StockService,
                private cartService: CartService,
                private snackbar: MatSnackBar)
    {
    }

    trackByFn = (index: number, item: IItem) => item.id;

    get items()
    {
        return this.stockService.currentItems;
    }

    onItemClick(item: IItem)
    {
        if(item.stock === 0)
        {
            this.snackbar.open(`${item.name} is not in stock`, "Close");
        }
        else if(item.ingredients && item.ingredients.length > 0)
        {
            this.openDialog(item);
        }
        else
        {
            this.cartService.addToCart({
                item: item,
                ingredients: item.ingredients?.map(x => x.id) ?? [],
                price: item.price
            });
        }
    }

    openDialog(item: IItem): void {
        const dialogRef = this.dialog.open<CustomizeItemDialogComponent, ICustomizeItemDialogInput, ICartEntry>(CustomizeItemDialogComponent, {
            width: '600px',
            data: {
                entry: {
                    item: item,
                    price: item.price,
                    ingredients: item.ingredients?.filter(x => x.default).map(x => x.id) ?? []
                },
                isEdit: false
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result)
            {
                this.cartService.addToCart(result);
            }
        });
    }
}

