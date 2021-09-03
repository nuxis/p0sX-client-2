import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BASE_URL, ICreditCheck} from "@models/pos";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'credit-check-dialog',
  templateUrl: './credit-check-dialog.component.html',
  styleUrls: ['./credit-check-dialog.component.scss']
})
export class CreditCheckDialogComponent implements OnInit {
    badge: string = "";

    constructor(public dialogRef: MatDialogRef<CreditCheckDialogComponent>,
                private http: HttpClient,
                private snackbar: MatSnackBar) {}

    credit: number = 0;
    left: number = 0;

    ngOnInit(): void
    {
    }

    onCancel()
    {
        this.dialogRef.close();
    }

    onEnter()
    {
        this.http.get<ICreditCheck>(`${BASE_URL}/credit/${this.badge}`)
            .subscribe(result => {
                this.credit = result.credit_limit;
                this.left = result.left;
                this.badge = "";
            }, (e: HttpErrorResponse) =>
            {
                this.credit = 0;
                this.left = 0;
                this.badge = "";
                const error = e.status === 404 ? "User not found" : "Failed to get credit";
                this.snackbar.open(error, "Close");
            });
    }
}
