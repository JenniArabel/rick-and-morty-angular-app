import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Character } from '../../interfaces/ApiResponse';

@Component({
  selector: 'character-info',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './character-info.component.html',
})
export class CharacterInfoComponent {
  @Input({ required: true }) character!: Character;
}
