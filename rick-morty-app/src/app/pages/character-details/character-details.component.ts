import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharactersService } from '../../services/characters.service';
import { Character } from '../../interfaces/ApiResponse';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { CharacterInfoComponent } from '../../components/character-info/character-info.component';
import { RouterModule } from '@angular/router';
import { CharacterEpisodesComponent } from '../../components/character-episodes/character-episodes.component';

@Component({
  selector: 'character-details',
  standalone: true,
  imports: [CommonModule, RouterModule, CharacterInfoComponent, CharacterEpisodesComponent],
  templateUrl: './character-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailsComponent implements OnInit {
  character = signal<Character | null>(null);
  episodes = signal<string[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private charactersService: CharactersService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          this.error.set(null);
          return this.charactersService.getCharacterById(params['id']);
        })
      )
      .subscribe({
        next: (character) => {
          this.character.set(character);
          if (character.episode) {
            this.episodes.set(
              character.episode.map((ep: string) => ep.split('/').pop() || '')
            );
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error fetching character:', error);
          this.error.set('Error loading character details');
          this.loading.set(false);
        },
      });
  }
}

// Note: NgOptimizedImage is imported where needed on standalone components
