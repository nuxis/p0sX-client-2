export const DEFAULT_IMAGE_URL = "assets/planet.png";

export enum PaymentMethod
{
    Cash = 0,
    Credit = 1,
    Undo = 7
}

type ItemId = number;
export type IngredientId = number;
type CategoryId = number;

export interface ICategory
{
    readonly id: CategoryId;
    readonly name: string;
}

export interface IIngredient
{
    readonly id: IngredientId;
    readonly default: boolean;
    readonly exclusive: boolean;
    readonly name: string;
    readonly price: number;
    readonly stock: number;
}

export interface IItem
{
    readonly id: ItemId;
    readonly name: string;
    readonly price: number;
    readonly stock: number;
    readonly barcode: string;
    readonly category: CategoryId;
    readonly image: string | undefined;
    readonly created_in_the_kitchen: boolean;
    readonly ingredients?: IIngredient[]
}

export interface ICartEntry
{
    readonly discount?: boolean;
    readonly item: IItem;
    readonly ingredients: IngredientId[];
    readonly price: number;
    readonly message?: string;
}

export interface IDiscount
{
    readonly id: number;
    readonly payment_method: PaymentMethod;
    readonly expression: string;
    readonly item: ItemId;
}

export interface IPurchaseInput
{
    readonly payment_method: PaymentMethod;
    readonly message?: string;
    readonly cashier_card: string;
    readonly card: string;
    readonly undo: boolean;
    readonly lines: {
        readonly item: ItemId;
        readonly message?: string;
        readonly ingredients?: IngredientId[];
    }[];
}

export interface ICreditCheck
{
    readonly used: number;
    readonly credit_limit: number;
    readonly left: number;
}

export interface IUser
{
    readonly first_name: string;
    readonly last_name: string;
    readonly credit: number;
    readonly card: string;
    readonly is_cashier: boolean;
}

export interface IOrderLine
{
    readonly id: number;
    readonly ingredients: {
        readonly id: number;
        readonly name: string;
    }[];
    readonly item: {
        readonly id: number;
        readonly name: string;
    }
}

export interface IOrder
{
    readonly id: number;
    readonly card: string;
    readonly cashier_card: string;
    readonly lines: IOrderLine[];
    readonly message: string;
    readonly payment_method: PaymentMethod;
    readonly undo: boolean;
}
