import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ICartEntry, IngredientId} from "@models/pos";

export interface ICustomizeItemDialogInput
{
    entry: ICartEntry;
    isEdit: boolean;
}

interface IIngredientSelection
{
    id: IngredientId;
    name: string;
    price: number;
    exclusive: boolean
    selected: boolean;
}

@Component({
  selector: 'customize-item-dialog',
  templateUrl: './customize-item-dialog.component.html',
  styleUrls: ['./customize-item-dialog.component.scss']
})
export class CustomizeItemDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<CustomizeItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ICustomizeItemDialogInput) {}

    public ingredients: IIngredientSelection[] = [];
    public message?: string = undefined;

    get totalPrice()
    {
        const ingredientPrice = this.ingredients
            .filter(x => x.selected)
            .reduce((p, i) => p + i.price, 0);
        return this.data.entry.item.price + ingredientPrice;
    }

    @HostListener('document:keydown.escape')
    onCancel() {
        this.dialogRef.close();
    }

    @HostListener('document:keydown.enter')
    onReturn() {
        this.dialogRef.close({
            item: this.data.entry.item,
            ingredients: this.ingredients.filter(x => x.selected).map(x => x.id),
            price: this.totalPrice,
            message: this.message,
        });
    }

    ngOnInit()
    {
        const item = this.data.entry.item;
        this.message = this.data.entry.message;
        if(this.data.entry.ingredients && item && item.ingredients)
        {
            this.ingredients = item.ingredients.map(x => ({
                id: x.id,
                name: x.name,
                price: x.price,
                exclusive: x.exclusive,
                selected: this.data.entry.ingredients!.some(y => y == x.id)
            }));
        }
    }

    onIngredientToggle(ingredient: IIngredientSelection)
    {
        if (ingredient.exclusive)
        {
            this.ingredients.forEach(x => x.selected = false);
            ingredient.selected = true;
        }
        else
        {
            ingredient.selected = !ingredient.selected;
        }
    }

    get itemName()
    {
        return this.data.entry.item.name;
    }
}
