import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './core/auth.guard';

/*
Definisco il mio array di Routes utilizzando anche il lazy loading visto che alcuni moduli non mi servono per tutti i componenti e bloccando alcune rotte con la guardia se
alcune condizioni sono sono soddisfatte.
*/
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'office',
    loadChildren: () =>
      import('./components/office/office.module').then((m) => m.OfficeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./components/forms/forms.module').then((m) => m.FormsModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
