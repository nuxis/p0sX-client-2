import {Component, OnInit} from '@angular/core';
import {StockService} from "@services/stock.service";

@Component({
    selector: 'categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    standalone: false
})
export class CategoriesComponent
{

    constructor(private stockService: StockService)
    {
    }

    get categories()
    {
        return this.stockService.categories;
    }

    setCategory(category: number | undefined)
    {
        this.stockService.setCategory(category);
    }

    selectedOptions: (number | undefined)[] = [undefined];
}
