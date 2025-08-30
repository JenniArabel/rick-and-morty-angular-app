import { Routes } from '@angular/router';
import { CharactersPageComponent } from './pages/characters-page/characters-page.component';

export const routes: Routes = [
  {
    path: 'characters',
    component: CharactersPageComponent,
  },
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'characters',
  },
];
