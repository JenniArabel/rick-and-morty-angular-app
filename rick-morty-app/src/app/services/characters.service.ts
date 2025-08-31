import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError, forkJoin, map } from 'rxjs';
import { ApiResponse, Character } from '../interfaces/ApiResponse';
import { Episode } from '../interfaces/Episode';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  // Endpoint base de la API
  private API_URL = 'https://rickandmortyapi.com/api';
  private CHARACTER_URL = `${this.API_URL}/character`;
  private EPISODE_URL = `${this.API_URL}/episode`;

  // usamos la nueva API de inyección (inject) en vez de constructor
  private http = inject(HttpClient);

  /**
   * Obtiene la página indicada de personajes.
   * La API ya viene paginada (20 por página).
   * Devuelve Observable<ApiResponse>.
   */
  getCharacters(page: number = 1): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(`${this.CHARACTER_URL}?page=${page}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }

  /**
   * Obtiene un personaje por su ID
   */
  getCharacterById(id: string): Observable<Character> {
    return this.http
      .get<Character>(`${this.CHARACTER_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene un episodio por su ID
   */
  getEpisodeById(id: string): Observable<Episode> {
    return this.http
      .get<Episode>(`${this.EPISODE_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene múltiples episodios por sus IDs
   */
  getEpisodesByIds(ids: string[]): Observable<Episode[]> {
    if (ids.length === 0)
      return new Observable((subscriber) => subscriber.next([]));
    if (ids.length === 1)
      return this.getEpisodeById(ids[0]).pipe(map((episode) => [episode]));

    return this.http
      .get<Episode[]>(`${this.EPISODE_URL}/${ids.join(',')}`)
      .pipe(catchError(this.handleError));
  }
}
