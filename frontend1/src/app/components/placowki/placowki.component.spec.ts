import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacowkiComponent } from './placowki.component';

describe('PlacowkiComponent', () => {
  let component: PlacowkiComponent;
  let fixture: ComponentFixture<PlacowkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacowkiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacowkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
