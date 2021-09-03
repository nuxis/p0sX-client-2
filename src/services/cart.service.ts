import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ICartEntry} from "@models/pos";

@Injectable({
    providedIn: 'root'
})
export class CartService
{
    private readonly cart$: BehaviorSubject<ICartEntry[]> = new BehaviorSubject<ICartEntry[]>([]);

    constructor()
    {
    }

    public get cart()
    {
        return this.cart$.asObservable();
    }

    public get cartValue()
    {
        return this.cart$.value;
    }

    get total()
    {
        return this.cart$.value.reduce((t, entry) => t + entry.price, 0);
    }

    public addToCart(entry: ICartEntry)
    {
        const cart = [entry, ...this.cart$.value];
        this.cart$.next(cart);
    }

    public emptyCart()
    {
        this.cart$.next([]);
    }

    public removeEntry(index: number)
    {
        const cart = this.cart$.value.filter((e, i) => i !== index);
        this.cart$.next(cart);
    }

    updateCartEntry(result: ICartEntry, index: number)
    {
        const cart = this.cart$.value.filter((e, i) => i !== index);
        cart.splice(index, 0, result)
        this.cart$.next(cart);
    }
}
