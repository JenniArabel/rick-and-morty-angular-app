import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CharacterEpisodesComponent } from '../character-episodes/character-episodes.component';
import { Character } from '../../interfaces/ApiResponse';

@Component({
  selector: 'character-info',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, CharacterEpisodesComponent],
  templateUrl: './character-info.component.html',
})
export class CharacterInfoComponent {
  @Input({ required: true }) character!: Character;
}
