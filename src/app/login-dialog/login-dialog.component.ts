import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatInput} from "@angular/material/input";
import {HttpClient} from "@angular/common/http";
import {IUser} from "@models/pos";
import {ConfigService} from "@services/config.service";

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements AfterViewInit {
    badge: string = "";
    orderId?: number = undefined;

    @ViewChild(MatInput)
    private badgeInput: MatInput | undefined = undefined;

    constructor(public dialogRef: MatDialogRef<LoginDialogComponent, IUser>,
                private config: ConfigService,
                private http: HttpClient,
                private snackbar: MatSnackBar) {}

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
            .get<IUser[]>(`${this.config.baseUrl}/user/?format=json&card=${this.badge}`)
            .subscribe(users => {
                this.badge = "";
                if(!users || users.length === 0)
                {
                    this.snackbar.open("User not found", "Close");
                    return;
                }

                const user = users[0];
                if(!user.is_cashier)
                {
                    this.snackbar.open("You must be a cashier to log in", "Close");
                    return;
                }
                this.dialogRef.close(user);
            });
    }
}
