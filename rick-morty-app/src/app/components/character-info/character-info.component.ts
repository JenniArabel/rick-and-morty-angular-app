import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Character } from '../../interfaces/ApiResponse';
import { StatusTranslatePipe } from '../../pipes/status-translate.pipe';
import { GenderTranslatePipe } from '../../pipes/gender-translate.pipe';

@Component({
  selector: 'character-info',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    StatusTranslatePipe,
    GenderTranslatePipe,
  ],
  templateUrl: './character-info.component.html',
})
export class CharacterInfoComponent {
  @Input({ required: true }) character!: Character;
}
