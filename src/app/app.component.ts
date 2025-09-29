import {AfterViewChecked, ChangeDetectorRef, Component, HostListener, Renderer2} from '@angular/core';
import {CreditCheckDialogComponent} from "./credit-check-dialog/credit-check-dialog.component";
import {StockService} from "@services/stock.service";
import {CartService} from "@services/cart.service";
import {LoginDialogComponent} from "./login-dialog/login-dialog.component";
import {IOrder, IUser} from "@models/pos";
import { HttpClient } from "@angular/common/http";
import {ConfigService} from "@services/config.service";
import { PreviousOrderDialog } from './previous-order-dialog/previous-order-dialog.component';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements AfterViewChecked {
    private barcodeBuffer: string = "";
    private loginDialog: MatDialogRef<LoginDialogComponent, IUser> | undefined = undefined;

    title = 'p0sX';
    isLightTheme: boolean = false;

    constructor(private renderer: Renderer2,
                private config: ConfigService,
                private http: HttpClient,
                private dialog: MatDialog,
                private stockService: StockService,
                private cartService: CartService,
                private changeDetector: ChangeDetectorRef)
    {
        document.title = this.title;
        if(window.localStorage.getItem("light-theme") === "true")
        {
            this.toggleTheme();
        }
    }

    @HostListener('document:keydown', ['$event'])
    private onText(e: KeyboardEvent)
    {
        if(e.key >= "0" && e.key <= "9")
        {
            this.barcodeBuffer += e.key;
        }

        if(this.barcodeBuffer.length > 13)
        {
            this.barcodeBuffer = this.barcodeBuffer.substr(1);
        }

        if(e.key == "Enter" && this.barcodeBuffer.length === 13)
        {
            const barcode = this.barcodeBuffer;
            const numbers = [...barcode].map(x => parseInt(x)).reverse();
            this.barcodeBuffer = "";
            const sum = numbers.slice(1).map((n, i) => n * (i % 2 == 0 ? 3 : 1)).reduce((r, v) => r + v, 0);
            const checkDigit = 10 - (sum % 10);

            if(checkDigit === numbers[0])
            {
                const item = this.stockService.findItem(item => item.barcode === barcode);
                if(item)
                {
                    this.cartService.addToCart({
                        item: item,
                        price: item.price,
                        ingredients: []
                    });
                }
            }
        }
    }

    get currentCashier()
    {
        return this.stockService.currentCashier;
    }

    toggleTheme()
    {
        if(this.isLightTheme)
        {
            window.localStorage.removeItem("light-theme");
            this.renderer.removeClass(document.documentElement, "light-theme");
        }
        else
        {
            window.localStorage.setItem("light-theme", "true");
            this.renderer.addClass(document.documentElement, "light-theme");
        }
        this.isLightTheme = !this.isLightTheme;
    }

    get themeIcon()
    {
        return this.isLightTheme ? "dark_mode" : "light_mode";
    }

    onOpenCreditCheckDialog()
    {
        this.dialog.open(CreditCheckDialogComponent, {
            width: "600px"
        });
    }

    onOpenPreviousOrderDialog()
    {
        this.dialog.open(PreviousOrderDialog, {
            width: "600px"
        });
    }

    ngAfterViewChecked(): void
    {
        if(!this.stockService.currentCashier)
        {
            this.ensureLoginDialog();
        }
    }

    logout()
    {
        this.stockService.logout();
    }

    private ensureLoginDialog()
    {
        if(this.loginDialog)
        {
            return;
        }
        this.loginDialog = this.dialog.open(LoginDialogComponent, {
            width: "600px",
            disableClose: true
        });

        this.loginDialog.afterClosed().subscribe(user => {
            this.loginDialog = undefined;
            if(user)
            {
                this.stockService.login(user);
            }
            this.changeDetector.detectChanges();
        });
    }

    onPrintReceipt()
    {
        const previousOrderString = localStorage.getItem('previous-order');
        if(!previousOrderString)
        {
            return;
        }
        const order = JSON.parse(previousOrderString) as IOrder;
        this.http
            .get(`${this.config.baseUrl}/receipt/${order.id}`)
            .subscribe();
    }
}
