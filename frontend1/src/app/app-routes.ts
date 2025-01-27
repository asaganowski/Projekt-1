import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlacowkiComponent } from './components/placowki/placowki.component';
import { LoginComponent } from './components/login/login.component';
import { UzytkownicyComponent } from './components/uzytkownicy/uzytkownicy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'placowki', component: PlacowkiComponent },
  { path: 'login', component: LoginComponent },
  { path: 'uzytkownicy', component: UzytkownicyComponent },
  { path: '**', redirectTo: '' },
];

