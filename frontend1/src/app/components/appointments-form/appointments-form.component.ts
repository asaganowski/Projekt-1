import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UzytkownicyService } from 'src/app/services/uzytkownicy.service';
import { catchError, map, of } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { PlacowkiService } from 'src/app/services/placowki.service';
import { WizytyService } from 'src/app/services/wizyty.service';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-appointments-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    LoadingComponent
  ],
  templateUrl: './appointments-form.component.html',
  styleUrls: ['./appointments-form.component.scss'],
  providers: [LoadingService, WizytyService, SnackBarService]
})
export class AppointmentsFormComponent {

  appointmentForm!: FormGroup;
  specjalisci!: {value: number, descr: string }[];

  constructor(
    public dialogRef: MatDialogRef<AppointmentsFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private uzytkService: UzytkownicyService,
    private placowkiService: PlacowkiService,
    private loadingService: LoadingService,
    private wizytyService: WizytyService,
    private authService: AuthService,
    private snackbarService: SnackBarService
  ){}

  ngOnInit(): void {

    this.appointmentForm = new FormGroup({
      data_wizyty: new FormControl('', Validators.required),
      id_placowki: new FormControl(null, Validators.required),
      id_specjalisty: new FormControl(null, Validators.required),
    });

    this.appointmentForm.get('id_placowki')?.valueChanges.subscribe(el => {
      console.log(el)
      if(el){
        this.appointmentForm.get('id_specjalisty')?.setValue(null);
        this.getSpecialist(el);
      }else{

      }
    })
  }

  close(){
    this.dialogRef.close(undefined);
  }

  getSpecialist(id_placowki: number){
    this.uzytkService.getSpecialistsByFacility(id_placowki).pipe(this.loadingService.showLoaderUntilCompleted()).subscribe(data => {
      if(data.status == 200){
        this.specjalisci = data.payload.map(val => ({value: val.id_uzytkownika, descr: `${val.imie} ${val.nazwisko} - ${val.specjalizacja}`}));
      }
      
    });
  }

  placowki$ = this.placowkiService.getAllFacilities().pipe(map(el => el.payload.map(el => ({descr: el.nazwa ,value: el.id_placowki }))), this.loadingService.showLoaderUntilCompleted());

  save(){
    const body = { ...this.appointmentForm.getRawValue(), id_pacjenta: this.authService.getUser().id };
    this.wizytyService.addNewAppointment(body).pipe(catchError(err => {
      console.log(err)
      this.snackbarService.showErrorSnackBar(err.error.msg);
      return of(null)
    })).subscribe(el => {
      if(el){
        this.dialogRef.close(undefined);
        this.snackbarService.showSuccessSnackBar(el.msg);
      }
    })
  }
}
