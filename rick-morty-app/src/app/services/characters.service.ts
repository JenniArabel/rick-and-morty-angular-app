import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  // Endpoint base de la API
  private API_URL = 'https://rickandmortyapi.com/api/character';

  // usamos la nueva API de inyección (inject) en vez de constructor
  private http = inject(HttpClient);

  /**
   * Obtiene la página indicada de personajes.
   * La API ya viene paginada (20 por página).
   * Devuelve Observable<ApiResponse>.
   */
  getCharacters(page: number = 1): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(`${this.API_URL}?page=${page}`)
      .pipe(catchError(this.handleError)
    );
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
}
