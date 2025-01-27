import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
  })
  export class SnackBarService {
    constructor(private snackBar: MatSnackBar) {}

    showSuccessSnackBar(message: string, action: string = 'OK', duration: number = 3000): void {
        this.snackBar.open(message, action, {
          duration,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
    }

    showErrorSnackBar(message: string, action: string = 'OK', duration: number = 3000): void {
        this.snackBar.open(message, action, {
          duration,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
    }
  }