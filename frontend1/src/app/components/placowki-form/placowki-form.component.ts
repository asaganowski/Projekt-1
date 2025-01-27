import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PlacowkiService } from 'src/app/services/placowki.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { catchError, of, Subject } from 'rxjs';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-placowki-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatSnackBarModule],
  templateUrl: './placowki-form.component.html',
  styleUrls: ['./placowki-form.component.scss'],
  providers: [SnackBarService]
})
export class PlacowkiFormComponent {

  formGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PlacowkiFormComponent>,
    private placowkiService: PlacowkiService,
    private snackbarService: SnackBarService
  ) {
    this.formGroup = new FormGroup({
      nazwa: new FormControl('', Validators.required),
      adres: new FormControl('', Validators.required),
      telefon: new FormControl('', Validators.required),
    });
  }

  save(){
    this.placowkiService.addNewFacility(this.formGroup.getRawValue()).pipe(catchError(err => {
          this.snackbarService.showErrorSnackBar(err.error.msg);
          return of(null)
        })).subscribe(data => {
          if(data){
            this.snackbarService.showSuccessSnackBar(data.msg);
            this.dialogRef.close(undefined);
          }
      
    })
  }

  close(){
    this.dialogRef.close(undefined);
  }
}
