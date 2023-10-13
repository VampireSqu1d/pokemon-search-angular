import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokeService } from './services/poke.service';
import { Pokemon } from './interfaces/pokemon';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PokemonSpecies } from './interfaces/pokemon-species';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'pokemon-search-app';

  //variables for storing the data retrived
  pokemon: Pokemon | undefined;
  pokemonSpecies: PokemonSpecies | undefined;
  pokemonImageUrl: string | undefined;
  pokemonDescription: string | undefined;

  pokeSearch = 'ditto';
  pokeSearchForm = this.fb.nonNullable.group({
    pokeSearchValue: '',
  });
  
  //booleans for showing labels
  searching: boolean = false;
  pokemonNotFound: boolean = false;
  DescriptionNotFound: boolean = false;
  //
  completedSearchSound = new Audio('../assets/12_3.mp3');
  
  storage: Storage = localStorage;//local storage used for caching latest pokemon

  onDestroy$: Subject<void> = new Subject();// used for unsubscribing from observables on destroy

  constructor(private pokeService: PokeService, private fb: FormBuilder) {
  }

  ngOnInit(): void {// retrives cached pokemon data on init if it exists
    let cachedPokemon = JSON.parse(this.storage.getItem('pokemon')!);
    if (cachedPokemon) {
      this.pokemon = cachedPokemon;
      console.log(cachedPokemon);
      this.pokemonImageUrl = this.pokemon?.sprites.other?.['official-artwork'].front_default;
    }

    let cachedDescription = JSON.parse(this.storage.getItem('especies')!);
    if (cachedDescription) {
      this.pokemonSpecies = cachedDescription;
      this.pokemonDescription = this.pokemonSpecies?.flavor_text_entries[0].flavor_text;
      console.log(this.pokemonSpecies);
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
        this.pokemonNotFound = false;
        this.completedSearchSound.play();
        this.pokemon = data;
        this.pokemonImageUrl = this.pokemon?.sprites.other?.['official-artwork'].front_default;
      },
      error: (error) => {
        this.pokemonNotFound = true;
      },
      complete: () => {
        this.getPokemonDescription();
        console.log(this.pokemon);
        this.savePokemonToCache();
      }
    });
  }

  getPokemonDescription() {
    this.pokeService.getPokemonDescription(this.pokemon!.species.name)
    .pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (data) => {
        this.DescriptionNotFound = false;
        this.pokemonSpecies = data;
        //for loop necesary for getting the description for the pokemon in english (for loop wont work outside of subscribe)
        for (let index = 0; index < this.pokemonSpecies!.flavor_text_entries.length; index++) {
          const element = this.pokemonSpecies!.flavor_text_entries[index];
          if (element.language.name == 'en') {
            this.pokemonDescription = element.flavor_text;
            break;
          }
        }
        //this.pokemonSpecies.color.name; //main color or pokemon
        
      },
      error: (error) => {
        this.DescriptionNotFound = true;
      },
      complete: () => {
        console.log(this.pokemonSpecies);
        this.searching = false;//deactivate bool for loading screen
        this.savePokemonEspeciesToCache();
      }
    });
  
  }

  sendSearch() {// this function passes the value from the search bar and calls the service function
    this.pokemon = undefined;
    this.pokemonSpecies = undefined;
    this.searching = true;//activate bool for loading screen
    this.pokeSearch = this.pokeSearchForm.value.pokeSearchValue?.toLocaleLowerCase() ?? 'ditto';
    
    this.getPokemon();//call the method for http call
  }

  savePokemonToCache() {
    this.storage.setItem('pokemon', JSON.stringify(this.pokemon));
  }

  savePokemonEspeciesToCache() {
    this.storage.setItem('especies', JSON.stringify(this.pokemonSpecies));
  }

}
