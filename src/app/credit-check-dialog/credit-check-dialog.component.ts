import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ICreditCheck} from "@models/pos";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "@services/config.service";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'credit-check-dialog',
  templateUrl: './credit-check-dialog.component.html',
  styleUrls: ['./credit-check-dialog.component.scss']
})
export class CreditCheckDialogComponent implements AfterViewInit {
    badge: string = "";

    @ViewChild(MatInput)
    private badgeInput: MatInput | undefined = undefined;

    constructor(public dialogRef: MatDialogRef<CreditCheckDialogComponent>,
                private config: ConfigService,
                private http: HttpClient,
                private snackbar: MatSnackBar) {}

    credit: number = 0;
    left: number = 0;

    ngAfterViewInit()
    {
        this.badgeInput?.stateChanges.subscribe(() => {
            if(!this.badgeInput?.focused)
            {
                this.badgeInput?.focus();
            }
        });
    }

    onCancel()
    {
        this.dialogRef.close();
    }

    onEnter()
    {
        this.http.get<ICreditCheck>(`${this.config.baseUrl}/credit/${this.badge}`)
            .subscribe({
                next: result =>
                {
                    this.credit = result.credit_limit;
                    this.left = result.left;
                    this.badge = "";
                },
                error: (e: HttpErrorResponse) =>
                {
                    this.credit = 0;
                    this.left = 0;
                    this.badge = "";
                    const error = e.status === 404 ? "User not found" : "Failed to get credit";
                    this.snackbar.open(error, "Close");
                }
            });
     }
}
