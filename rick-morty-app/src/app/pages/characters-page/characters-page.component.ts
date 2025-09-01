/**
 * Characters Page Component - Páginal principal
 * Muestra los personajes de Rick y Morty. 10 por página (2 x 5).
 * Maneja la carga de los personajes, la paginación y los estados de error.
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
  // Implementamos OnInit para cargar los datos automáticamente cuando el componente se inicializa.

  // Injectamos el servicio de personajes para llamadas a la API
  private characterService = inject(CharactersService);

  // Manejo de estado usando signals
  characters = signal<Character[]>([]); // Lista de personajes a mostrar
  page = signal<number>(1); // Número de página actual
  totalPages = signal<number>(0); // Número total de páginas disponibles
  loading = signal<boolean>(false); // Indicador de estado de carga
  error = signal<string | null>(null); // Mensaje de error si lo hay

  /* Páginas a mostrar en el paginador
    Usamos computed para calcular dinámicamente la paginación,
    mostrando 3 páginas consecutivas centradas en la actual.
  */
  pages = computed(() => {
    // Página actual en la que el usuario se encuentra
    const currentPage = this.page();
    const lastPage = this.totalPages();

    // Mostrar 3 páginas consecutivas centradas en la página actual
    // Página inicial para el paginador
    let start = currentPage - 1;

    // Ajustar el inicio si estamos cerca del principio o final
    // Si estamos en la primera página (0 por eso es < 1), mostrar páginas 1, 2 y 3
    if (start < 1) {
      start = 1;
    } else if (start > lastPage - 2) {
      start = Math.max(1, lastPage - 2);
      /*Esta condición maneja el caso cuando estamos cerca del final
      Usamos Math.max para asegurarnos de que no sea menor
      que 1,
      y para que start sea 2 números menos que el número de la última página.
      */
    }

    return [start, start + 1, start + 2].filter((page) => page <= lastPage);
  });

  // Cargamos la primera página al inicializar el componente
  ngOnInit(): void {
    this.loadPage(this.page());
  }

  /**
   * Carga una página específica de personajes
   * @param pageNumber Número de página a cargar
   */
  loadPage(pageNumber: number) {
    if (pageNumber < 1) return;
    // Si el número de página es menor que 1
    // Entonces return termina la ejecución de la función inmediatamente

    this.loading.set(true); // Indicamos que estamos cargando datos
    this.error.set(null); // Limpiamos cualquier mensaje de error previo

    // Realizamos la llamada al servicio para obtener los personajes
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
