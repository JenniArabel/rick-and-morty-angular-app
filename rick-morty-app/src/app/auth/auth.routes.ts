import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {  noAuthGuard } from './guards/no-auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard], // Evita que usuarios autenticados accedan al login
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard], // Evita que usuarios autenticados accedan al register
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

export default authRoutes;
