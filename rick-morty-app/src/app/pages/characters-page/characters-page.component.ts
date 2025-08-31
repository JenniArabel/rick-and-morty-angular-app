/**
 * Characters Page Component
 * Displays a paginated grid of Rick and Morty characters.
 * Manages character loading, pagination, and error states.
 */
import { CharactersService } from '../../services/characters.service';
import { Character } from './../../interfaces/ApiResponse';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';

@Component({
  selector: 'characters-page',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent, PaginatorComponent],
  templateUrl: './characters-page.component.html',
})
export class CharactersPageComponent implements OnInit {
  // Inject the character service for API calls
  private characterService = inject(CharactersService);

  // State management using signals
  characters = signal<Character[]>([]); // List of characters to display
  page = signal<number>(1); // Current page number
  totalPages = signal<number>(0); // Total number of pages available
  loading = signal<boolean>(false); // Loading state indicator
  error = signal<string | null>(null); // Error message if any

  pages = computed(() => {
    const currentPage = this.page();
    const lastPage = this.totalPages();

    // Mostrar 3 páginas consecutivas centradas en la página actual
    let start = currentPage - 1;

    // Ajustar el inicio si estamos cerca del principio o final
    if (start < 1) {
      start = 1;
    } else if (start > lastPage - 2) {
      start = Math.max(1, lastPage - 2);
    }

    return [start, start + 1, start + 2].filter((page) => page <= lastPage);
  });

  ngOnInit(): void {
    this.loadPage(this.page());
  }

  /**
   * Carga una página específica de personajes
   * @param pageNumber Número de página a cargar
   */
  loadPage(pageNumber: number) {
    if (pageNumber < 1) return;

    this.loading.set(true);
    this.error.set(null);

    this.characterService.getCharacters(pageNumber).subscribe({
      next: (res) => {
        // Limitamos a mostrar solo los primeros 10 personajes
        const first10Characters = res.results.slice(0, 10);
        this.characters.set(first10Characters);
        this.totalPages.set(res.info.pages);
        this.page.set(pageNumber);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set(
          'No se pudieron cargar los personajes. Intenta recargar la página.'
        );
        this.loading.set(false);
      },
    });
  }

  /**
   * Navega a una página específica si es válida
   * @param pageNumber Número de página destino
   */
  goTo(pageNumber: number) {
    if (
      pageNumber === this.page() ||
      pageNumber < 1 ||
      pageNumber > this.totalPages()
    )
      return;
    this.loadPage(pageNumber);
  }

  prev() {
    this.goTo(this.page() - 1);
  }
  next() {
    this.goTo(this.page() + 1);
  }

  trackById(index: number, item: Character) {
    return item.id;
  }
}
