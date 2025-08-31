import { Component, Input } from '@angular/core';
import { Character } from '../../interfaces/ApiResponse';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'character-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  templateUrl: './character-card.component.html',
})
export class CharacterCardComponent {
  @Input({ required: true }) character!: Character;
  @Input() isPriority: boolean = false;

  constructor(private router: Router) {}

  public goToDetail(): void {
    this.router.navigate(['/characters', this.character.id]);
  }
}
