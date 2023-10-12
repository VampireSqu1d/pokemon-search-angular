import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from 'src/app/interfaces/pokemon';
import { PokeService } from 'src/app/services/poke.service';

@Component({
  selector: 'app-poke-card',
  templateUrl: './poke-card.component.html',
  styleUrls: ['./poke-card.component.css']
})
export class PokeCardComponent implements OnInit{

  @Input() pokemonName: string | undefined;
  //pokemon$ = this.pokeService.getPokemon(this.pokemon);
  public pokemon: Pokemon | undefined;
  constructor(private pokeService: PokeService) {

  }

  ngOnInit(): void {
    if (this.pokemonName != null) {
      this.pokeService.getPokemon(this.pokemonName!).subscribe((data) => {
        this.pokemon = data;
      }); 
    }
    
  }

  getPokemon(pokemon: string): Observable<Pokemon> {
    return this.pokeService.getPokemon(pokemon);
  }
}
