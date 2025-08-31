import { Component, Input, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../services/characters.service';
import { Episode } from '../../interfaces/Episode';

@Component({
  selector: 'character-episodes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-episodes.component.html',
})
export class CharacterEpisodesComponent implements OnInit {
  @Input({ required: true }) set episodeUrls(urls: string[]) {
    if (urls && urls.length > 0) {
      const episodeIds = urls.map((url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      });
      this.loadEpisodes(episodeIds);
    }
  }

  episodes = signal<Episode[]>([]);

  constructor(private charactersService: CharactersService) {}

  formatEpisodeCode(code: string): string {
    // El código viene en formato "S01E01" o "S01E11"
    const parts = code.match(/S(\d+)E(\d+)/);
    if (parts) {
      const seasonNumber = Number(parts[1]);
      const episodeNumber = Number(parts[2]);
      return `Episode ${episodeNumber} (Season ${seasonNumber})`;
    }
    return code; // Si no coincide el formato, devolvemos el código original
  }

  private loadEpisodes(episodeIds: string[]) {
    this.charactersService.getEpisodesByIds(episodeIds).subscribe({
      next: (episodes) => {
        this.episodes.set(episodes);
      },
      error: (error) => {
        console.error('Error fetching episodes:', error);
      },
    });
  }

  ngOnInit() {
    // No need for initialization here as it's handled in the setter
  }
}
