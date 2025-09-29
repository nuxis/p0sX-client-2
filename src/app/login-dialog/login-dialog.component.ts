import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IUser} from "@models/pos";
import {ConfigService} from "@services/config.service";
import {MatInput} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss'],
    standalone: false
})
export class LoginDialogComponent implements AfterViewInit {
    badge: string = "";
    orderId?: number = undefined;

    @ViewChild(MatInput)
    private badgeInput: MatInput | undefined = undefined;

    constructor(public dialogRef: MatDialogRef<LoginDialogComponent, IUser>,
                private config: ConfigService,
                private http: HttpClient,
                private snackbar: MatSnackBar,
                private changeDetector: ChangeDetectorRef) {}

    ngAfterViewInit()
    {
        this.badgeInput?.stateChanges.subscribe(() => {
            if(!this.badgeInput?.focused)
            {
                this.badgeInput?.focus();
            }
        });
    }

    onLogin()
    {
        if(!this.badge)
        {
            this.snackbar.open("You must enter a badge number", "Close");
            return;
        }

        this.http
            .get<IUser>(`${this.config.baseUrl}/user/${this.badge}/?format=json`)
            .subscribe({
                next: user => {
                    this.badge = "";
                    if(!user)
                    {
                        this.snackbar.open("User not found", "Close");
                        return;
                    }

                    if(!user.is_cashier)
                    {
                        this.snackbar.open("You must be a cashier to log in", "Close");
                        return;
                    }
                    this.dialogRef.close(user);
                },
                error: (e: HttpErrorResponse) => {
                    this.badge = "";
                    this.snackbar.open(e.status == 404 ? "User not found" : "Failed to get user", "Close");
                    this.changeDetector.detectChanges();
                }
            });
    }
}
