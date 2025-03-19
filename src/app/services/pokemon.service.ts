import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://localhost:7035/api/Pokemon';

  constructor(private http: HttpClient) {}

  getPokemons(offset: number, limit: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?offset=${offset}&limit=${limit}`).pipe(
      catchError(this.handleError)
    );
  }

  getPokemonDetails(identifier: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${identifier}`).pipe(
      catchError(this.handleError)
    );
    
  }

  addFavoritePokemon(pokemonId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${pokemonId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  removeFavoritePokemon(pokemonId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${pokemonId}`).pipe(
      catchError(this.handleError)
    );
  }

  getFavoritePokemons(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/favorites`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error); 
  }
}
