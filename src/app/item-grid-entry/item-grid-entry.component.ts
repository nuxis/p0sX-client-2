import {Component, Input} from '@angular/core';
import {DEFAULT_IMAGE_URL, IItem} from "@models/pos";

@Component({
    selector: 'item-grid-entry',
    templateUrl: './item-grid-entry.component.html',
    styleUrls: ['./item-grid-entry.component.scss']
})
export class ItemGridEntryComponent
{
    @Input()
    public item: IItem = {
        name: "",
        price: 0,
        image: "",
        barcode: "",
        id: 0,
        category: 0,
        created_in_the_kitchen: false,
        ingredients: [],
        stock: 0
    };

    public DEFAULT_IMAGE_URL = DEFAULT_IMAGE_URL;

    constructor()
    {
    }
}
