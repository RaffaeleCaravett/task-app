import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './core/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [

  {
    path:'',
    component:HomeComponent
  },
  {
    path:'office',
    loadChildren: () => import('./components/office/office.module').then(m => m.OfficeModule) ,canActivate:[AuthGuard]  },
  {
    path:'forms',
    loadChildren: () => import('./components/forms/forms.module').then(m => m.FormsModule) },
    {
      path: '**',
      redirectTo:''
    }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
