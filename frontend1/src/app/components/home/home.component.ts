import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentsFormComponent } from '../appointments-form/appointments-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { DataGridComponent, TABLE_ACTION_KEY, TableAction } from 'src/app/shared/components/data-grid/data-grid.component';
import { ListViewComponent } from 'src/app/shared/components/list-view/list-view.component';
import { WizytyService } from 'src/app/services/wizyty.service';
import { TableColumnNames, ChangedTableColumnNames } from 'src/app/model/tableColumn.type';
import { UserModel } from 'src/app/model/userModel.interface';
import { WizytaModel } from 'src/app/model/wizytaModel.interface';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    DataGridComponent,
    ListViewComponent,
    MatSnackBarModule
  ],
  providers: [SnackBarService]
})
export class HomeComponent {

  data$ = this.wizytyService.getAllAppointments(this.authService.getUser()?.id, this.authService.userRole);
  
  displayedColumns: TableColumnNames<WizytaModel> = ['data_wizyty', 'nazwa_placowki', 'adres_placowki', 'uczestnik', 'specjalizacja', 'za_ile_dni'];
  
  changedColumnHeaderNames: ChangedTableColumnNames<WizytaModel> = {
    data_wizyty: 'Data wizyty',
    nazwa_placowki: 'Nazwa placówki',
    adres_placowki: 'Adres placówki',
    uczestnik: this.isPatient ? 'Imię i nazwisko lekarza' : 'Imię i nazwisko pacjenta',
    specjalizacja: 'Specjalizacja',
    za_ile_dni: "Wizyta za..."
  }

  rowButtonAction: TableAction<WizytaModel>[] = [
      { key: TABLE_ACTION_KEY.ADD, name: "Dodaj", icon: "add", color: "button-green", callback: () => this.onAddClicked() },
      { key: TABLE_ACTION_KEY.EDIT, name: "Edytuj", icon: "edit", color: "button-yellow", callback: () => {} },
      { key: TABLE_ACTION_KEY.DELETE, name: "Usuń", icon: "delete", color: "button-red", callback: (el) => this.onDeleteClicked(el!) },
  ]
  
  constructor(
    private _matDialog: MatDialog,
    private authService: AuthService,
    private wizytyService: WizytyService,
    private snackbarService: SnackBarService
  ) {}

  get isAdmin(){
    return this.authService.isAdmin;
  }

  get isPatient(){
    return this.authService.isPatient;
  }

  get isLoggedIn(){
    return this.authService.isAuthenticated;
  }

  get isSpecialist(){
    return this.authService.isSpecialist;
  }

  private onDeleteClicked(el: WizytaModel){
    console.log(el)
    this.wizytyService.deleteAppointment(el.id_wizyty).pipe(catchError(err => {
      this.snackbarService.showErrorSnackBar(err.error.msg);
      return of(null)
    })).subscribe(el => {
      if(el){
        this.snackbarService.showSuccessSnackBar(el.msg);
      }
    })
  }

  private onAddClicked(){
    const questionDialogRef = this._matDialog.open(AppointmentsFormComponent,{
      autoFocus: false,
      restoreFocus: false,
      data: null,
      disableClose: true,
    })

    questionDialogRef.afterClosed().subscribe(result => {
      if (!!result) {
      }
    });
  }
}
