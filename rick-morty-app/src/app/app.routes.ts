import { Routes } from '@angular/router';
import { CharactersPageComponent } from './pages/characters-page/characters-page.component';
import { CharacterDetailsComponent } from './pages/character-details/character-details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'characters',
    component: CharactersPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'characters/:id',
    component: CharacterDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'episodes',
    component: NotFoundComponent,
  },
  {
    path: 'locations',
    component: NotFoundComponent,
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
