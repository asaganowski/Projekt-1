import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UzytkownicyComponent } from './uzytkownicy.component';

describe('UzytkownicyComponent', () => {
  let component: UzytkownicyComponent;
  let fixture: ComponentFixture<UzytkownicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UzytkownicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UzytkownicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
