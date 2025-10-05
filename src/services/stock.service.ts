import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, timer} from "rxjs";
import {ICategory, IDiscount, IItem, IUser} from "@models/pos";
import { HttpClient } from "@angular/common/http";
import {map} from "rxjs/operators";
import {ConfigService} from "@services/config.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class StockService
{
    private readonly categories$ = new BehaviorSubject<ICategory[]>([]);
    private readonly items$ = new BehaviorSubject<IItem[]>([]);
    private discounts$: IDiscount[] = [];
    private readonly itemById = new Map<number, IItem>();
    private currentCashier$: IUser | undefined = undefined;
    private selectedCategory: number | undefined = undefined;

    public get currentCashier(): Readonly<IUser> | undefined
    {
        return this.currentCashier$;
    }

    constructor(private http: HttpClient, private snackbar: MatSnackBar, private config: ConfigService)
    {
        timer(0, 60 * 1000).subscribe(() => this.fetchData());
    }

    public login(user: IUser)
    {
        this.currentCashier$ = user;
    }

    public logout()
    {
        this.currentCashier$ = undefined;
    }

    private fetchData()
    {
        const itemRequest =  this.http.get<IItem[]>(`${this.config.baseUrl}/items/`);
        const categoryRequest =  this.http.get<IItem[]>(`${this.config.baseUrl}/categories/`);
        const discountRequest =  this.http.get<IDiscount[]>(`${this.config.baseUrl}/discounts/`);

        forkJoin([itemRequest, categoryRequest, discountRequest])
            .subscribe({
                next: ([items, categories, discounts]) => {
                    this.categories$.next(categories);
                    this.items$.next(items);
                    this.discounts$ = discounts;
                    for(const item of items)
                    {
                        this.itemById.set(item.id, item);
                    }
                },
                error: () => {
                    this.snackbar.open("Failed to load data", "Close");
                }
            });
    }

    public get categories()
    {
        return this.categories$.asObservable();
    }

    public get currentItems(): Observable<IItem[]>
    {
        return this.items$
            .asObservable()
            .pipe(
                map(x => x.filter(y => y.price > 0)),
                map(x => x.filter(y => this.selectedCategory == undefined || y.category == this.selectedCategory))
            );
    }

    public setCategory(category: number | undefined)
    {
        this.selectedCategory = category;
        this.items$.next(this.items$.value);
    }

    public resolveItemId(id: number)
    {
        return this.itemById.get(id);
    }

    public findItem(callback: (item: IItem) => boolean): IItem | undefined
    {
        return this.items$.value.find(callback)
    }

    public discounts(): ReadonlyArray<IDiscount>
    {
        return this.discounts$;
    }
}
