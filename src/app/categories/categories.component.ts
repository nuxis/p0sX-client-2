import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StockService} from "@services/stock.service";
import {ICategory} from "@models/pos";

@Component({
    selector: 'categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit
{

    constructor(private http: HttpClient, private stockService: StockService)
    {
    }

    ngOnInit(): void
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
    trackByFn = (index: number, category: ICategory) => category.id;

}
