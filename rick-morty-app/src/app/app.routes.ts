import { Routes } from '@angular/router';
import { CharactersPageComponent } from './pages/characters-page/characters-page.component';
import { CharacterDetailsComponent } from './pages/character-details/character-details.component';

export const routes: Routes = [
  {
    path: 'characters',
    component: CharactersPageComponent,
  },
  {
    path: 'characters/:id',
    component: CharacterDetailsComponent,
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
