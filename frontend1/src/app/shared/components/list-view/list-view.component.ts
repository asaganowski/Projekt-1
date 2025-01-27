import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  standalone: true
})
export class ListViewComponent {

  @Input()
  public title = '';
}
