import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { Routes, provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { AppModule } from './app/app.module';
export const routes: Routes = [
  {
      path: '',
      loadChildren: () => import('./app/app-routes').then(m => m.routes),
      data: { breadcrumb: { label: 'Strona glówna', alias: 'Home' } }
  },
  {
      path: '**',
      redirectTo: '/'
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
  ],
}).catch((err) => console.error(err));
