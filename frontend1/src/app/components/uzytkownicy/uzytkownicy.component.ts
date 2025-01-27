import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { JsonResponseModel } from 'src/app/model/jsonResponseModel.interface';
import { ChangedTableColumnNames, TableColumnNames } from 'src/app/model/tableColumn.type';
import { UserDto, UserModel } from 'src/app/model/userModel.interface';
import { UzytkownicyService } from 'src/app/services/uzytkownicy.service';
import { DataGridComponent, TABLE_ACTION_KEY, TableAction } from 'src/app/shared/components/data-grid/data-grid.component';
import { ListViewComponent } from 'src/app/shared/components/list-view/list-view.component';
import { UsersFormComponent } from '../users-form/users-form.component';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-uzytkownicy',
  templateUrl: './uzytkownicy.component.html',
  styleUrls: ['./uzytkownicy.component.scss'],
  standalone: true,
  imports: [
    DataGridComponent,
    ListViewComponent,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [SnackBarService]
})
export class UzytkownicyComponent {

  constructor(private uzytkService: UzytkownicyService, private matDialog: MatDialog) { }

  data$ = this.uzytkService.getUsers();

  displayedColumns: TableColumnNames<UserDto> = ['imie', 'nazwisko', 'login', 'rola', 'specjalizacja', 'placowki'];

  changedColumnHeaderNames: ChangedTableColumnNames<UserDto> = {
    imie: 'Imię',
    nazwisko: 'Nazwisko',
    login: 'Login',
    rola: 'Rola',
    specjalizacja: 'Specjalizacja',
    placowki: 'Placówki, do których należy specjalista'
  }

  rowButtonAction: TableAction<UserDto>[] = [
    { key: TABLE_ACTION_KEY.ADD, name: "Dodaj", icon: "add", color: "button-green", callback: () => this.onAddClicked() },
    { key: TABLE_ACTION_KEY.EDIT, name: "Edytuj", icon: "edit", color: "button-yellow", callback: () => {} },
    { key: TABLE_ACTION_KEY.DELETE, name: "Usuń", icon: "delete", color: "button-red", callback: () => {} },
  ]

  onAddClicked() {
    const questionDialogRef = this.matDialog.open(UsersFormComponent, {
      autoFocus: false,
      restoreFocus: false,
      disableClose: true,
      maxHeight: '300px'
    })

    questionDialogRef.afterClosed().subscribe(result => {
      if (!!result) {

      }
    });
  }

  onEditClicked(item: UserModel) {
    console.log(item)
  }

  onDeleteClicked(item: UserModel) {
    console.log(item)
  }

}
