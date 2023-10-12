import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokeService } from './services/poke.service';
import { Pokemon } from './interfaces/pokemon';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'pokemon-search-app';
  pokemon: Pokemon | undefined;
  pokeSearch = 'ditto';
  pokemonImageUrl: string | undefined;
  pokeSearchForm = this.fb.nonNullable.group({
    pokeSearchValue: '',
  });
  
  searching: boolean = false;
  notFound: boolean = false;
  completedSearchSound = new Audio('../assets/12_3.mp3');
  
  storage: Storage = localStorage;
  onDestroy$: Subject<void> = new Subject();

  constructor(private pokeService: PokeService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    let cachedPokemon = JSON.parse(this.storage.getItem('pokemon')!);
    if (cachedPokemon != null) {
      this.pokemon = cachedPokemon;
      this.pokemonImageUrl = this.pokemon?.sprites.other?.['official-artwork'].front_default;
    }
  }

  ngOnDestroy(): void {// unsubcribes from observables when component is destroid
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getPokemon() {
    this.pokeService.getPokemon(this.pokeSearch)
    .pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (data) => {
        this.notFound = false;
        this.completedSearchSound.play();
        this.pokemon = data;
        this.pokemonImageUrl = this.pokemon?.sprites.other?.['official-artwork'].front_default;
      },
      error: (error) => {
        this.notFound = true;
      },
      complete: () => {
        this.savePokemonToCache();
      }
    });
  }

  sendSearch() {// this function passes the value from the search bar and calls the service function
    this.pokemon = undefined;
    this.searching = true;
    this.pokeSearch = this.pokeSearchForm.value.pokeSearchValue?.toLocaleLowerCase() ?? 'ditto';
    //this.getPokemon(this.pokeSearch);
    this.getPokemon();
  }

  savePokemonToCache() {
    this.storage.setItem('pokemon', JSON.stringify(this.pokemon));
  }
}
