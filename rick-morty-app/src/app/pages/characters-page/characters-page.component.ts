import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-characters-page',
  imports: [],
  templateUrl: './characters-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersPageComponent { }
