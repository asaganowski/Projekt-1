import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UzytkownicyService } from 'src/app/services/uzytkownicy.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SpecjalizacjeEnum } from 'src/app/enum/specjalizacje.enum';
import { RolaEnum } from 'src/app/enum/rola.enum';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { catchError, map, of } from 'rxjs';
import { PlacowkiService } from 'src/app/services/placowki.service';
import { UserModel } from 'src/app/model/userModel.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent, MatInputModule,
      MatButtonModule, MatOptionModule,MatSelectModule, MatSnackBarModule],
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
  providers: [LoadingService, PlacowkiService, SnackBarService]
})
export class UsersFormComponent {

    formGroupUser!: FormGroup;
  
    constructor(
      public dialogRef: MatDialogRef<UsersFormComponent>,
      private placowkiService: PlacowkiService,
      private uzytkownicyService: UzytkownicyService,
      private loadingService: LoadingService,
      private snackbarService: SnackBarService
    ){
      this.formGroupUser = new FormGroup({
        login: new FormControl('', Validators.required),
        haslo: new FormControl('', Validators.required),
        imie: new FormControl('', Validators.required),
        nazwisko: new FormControl('', Validators.required),
        rola: new FormControl('', Validators.required),
        specjalizacja: new FormControl(),
        placowki_id: new FormControl(),
      });
    }

    get rola() { return this.formGroupUser?.get('rola') as FormControl; }; 
  
    ngOnInit(): void {
      
    }

    specjalizacje = Object.values(SpecjalizacjeEnum).map(el => ({descr: el, value: el}));
    role = Object.values(RolaEnum).map(el => ({descr: el, value: el}));
    placowki$ = this.placowkiService.getAllFacilities().pipe(map(el => el.payload.map(el => ({descr: el.nazwa ,value: el.id_placowki }))), this.loadingService.showLoaderUntilCompleted());
    
  
    close(){
      this.dialogRef.close(undefined);
    }

    save(){
      this.uzytkownicyService.addUser(this.formGroupUser.getRawValue()).pipe(catchError(err => {
        this.snackbarService.showErrorSnackBar(err.error.msg);
        return of(null)
      })).subscribe(data => {
        if(data){
          this.snackbarService.showSuccessSnackBar(data.msg);
          this.dialogRef.close(undefined);
        }
      })
    }
}
