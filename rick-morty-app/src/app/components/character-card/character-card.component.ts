import { Component, Input } from '@angular/core';
import { Character } from '../../interfaces/ApiResponse';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'character-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './character-card.component.html',
})
export class CharacterCardComponent {
  @Input({ required: true }) character!: Character;
  @Input() isPriority: boolean = false;
}
