import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokeService {

  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private httpClient: HttpClient) { }


  getPokemon(pokemon: string): Observable<Pokemon> {
    return this.httpClient.get<Pokemon>(`${this.baseUrl}/${pokemon}`);
  }


}
