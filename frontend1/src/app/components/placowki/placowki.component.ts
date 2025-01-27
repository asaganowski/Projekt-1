import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FacilityModel } from 'src/app/model/facilityModel.interface';
import { TableColumnNames, ChangedTableColumnNames } from 'src/app/model/tableColumn.type';
import { PlacowkiService } from 'src/app/services/placowki.service';
import { DataGridComponent, TABLE_ACTION_KEY, TableAction } from 'src/app/shared/components/data-grid/data-grid.component';
import { ListViewComponent } from 'src/app/shared/components/list-view/list-view.component';
import { PlacowkiFormComponent } from '../placowki-form/placowki-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-placowki',
  templateUrl: './placowki.component.html',
  styleUrls: ['./placowki.component.scss'],
  standalone: true,
  imports: [
    DataGridComponent,
    ListViewComponent,
    MatDialogModule
  ]
})
export class PlacowkiComponent {

  constructor(private placowkiService: PlacowkiService, private matDialog: MatDialog, private authService: AuthService) { }

  data$ = this.placowkiService.getAllFacilities();

  displayedColumns: TableColumnNames<FacilityModel> = ['nazwa', 'adres', 'telefon', 'ilosc_specjalistow'];

  changedColumnHeaderNames: ChangedTableColumnNames<FacilityModel> = {
    nazwa: 'Nazwa placówki',
    adres: 'Adres placówki',
    telefon: 'Telefon kontaktowy',
    ilosc_specjalistow: 'Ilość specjalistów w placówce'
  }

  rowButtonAction: TableAction<FacilityModel>[] = [
    { key: TABLE_ACTION_KEY.ADD, name: "Dodaj", icon: "add", color: "button-green", callback: () => this.onAddClicked() },
    { key: TABLE_ACTION_KEY.EDIT, name: "Edytuj", icon: "edit", color: "button-yellow", callback: () => { } },
    { key: TABLE_ACTION_KEY.DELETE, name: "Usuń", icon: "delete", color: "button-red", callback: el => this.onDeleteClicked(el!) },
  ]

  get isAdmin(){
    return this.authService.isAdmin;
  }

  onAddClicked() {
    const questionDialogRef = this.matDialog.open(PlacowkiFormComponent, {
      autoFocus: false,
      restoreFocus: false,
      disableClose: true,
      maxHeight: '300px'
    })

    questionDialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.data$ = this.placowkiService.getAllFacilities();
      }
    });
  }

  onEditClicked(item: FacilityModel) {
    console.log(item)
  }

  onDeleteClicked(item: FacilityModel) {
    this.placowkiService.deleteFacility(item.id_placowki).subscribe();
  }

}
