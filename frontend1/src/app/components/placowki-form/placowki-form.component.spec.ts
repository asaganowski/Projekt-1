import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacowkiFormComponent } from './placowki-form.component';

describe('PlacowkiFormComponent', () => {
  let component: PlacowkiFormComponent;
  let fixture: ComponentFixture<PlacowkiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlacowkiFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacowkiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
