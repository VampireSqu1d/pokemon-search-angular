import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-poke-search-bar',
  templateUrl: './poke-search-bar.component.html',
  styleUrls: ['./poke-search-bar.component.css']
})
export class PokeSearchBarComponent {
  @Output() searchEvent = new EventEmitter<string>();

  sendSearch(pokemon: string) {
    this.searchEvent.emit(pokemon);
  }
}
