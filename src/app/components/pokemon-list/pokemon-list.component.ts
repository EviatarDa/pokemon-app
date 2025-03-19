import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PokemonService } from '../../services/pokemon.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditNameDialogComponent } from '../edit-name-dialog/edit-name-dialog.component';
import { PokemonDetailsDialogComponent } from '../pokemon-details-dialog/pokemon-details-dialog.component';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    EditNameDialogComponent,
    PokemonDetailsDialogComponent,
    MatCardModule,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;

  pokemons: any[] = [];
  favoritesSet: Set<number> = new Set();
  showOnlyFavorites: boolean = false;
  //mutex
  isLoading: boolean = false;
  offset: number = 0;
  limit: number = 20;
  editingPokemonId: number | null = null;
  
  displayedColumns: string[] = ['id', 'name', 'details', 'image', 'favorite'];

  constructor(private pokemonService: PokemonService,  private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.loadPokemons();
    this.loadFavoritePokemons();
  }

  ngAfterViewInit(): void {
    this.tableContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  loadPokemons(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.pokemonService.getPokemons(this.offset, this.limit).subscribe({
      next: (data) => {
        this.pokemons = [...this.pokemons, ...data];
        this.offset += this.limit;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Pokémon list:', error);
        this.isLoading = false;
        this.router.navigate(['/error'], { queryParams: { message: 'שרת הפוקימונים אינו זמין.' } });
      }
    });
  }

  loadFavoritePokemons(): void {
    this.pokemonService.getFavoritePokemons().subscribe({
      next: (favorites) => {
        this.favoritesSet = new Set(favorites);
      },
      error: (error) => {
        console.error('Error loading favorite Pokémons:', error);
        this.router.navigate(['/error'], { queryParams: { message: 'שרת הפוקימונים אינו זמין.' } });
      }
    });
  }
  

  onScroll(): void {
    const container = this.tableContainer.nativeElement;
    const threshold = 100;

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - threshold) {
      this.loadPokemons();
    }
  }

  get filteredData(): any[] {
    return this.showOnlyFavorites
      ? this.pokemons.filter(pokemon => this.favoritesSet.has(pokemon.id))
      : this.pokemons;
  }

  toggleFavorite(pokemonId: number): void {
    if (this.favoritesSet.has(pokemonId)) {
      this.favoritesSet.delete(pokemonId);
      this.pokemonService.removeFavoritePokemon(pokemonId).subscribe({
        next: () => console.log(`Pokemon ${pokemonId} removed from favorites`),
        error: (err) => {
          console.error(`Error removing Pokémon ${pokemonId} from favorites:`, err);
          this.router.navigate(['/error'], { queryParams: { message: 'שגיאה בהסרת הפוקימון מהמועדפים.' } });
        }
      });
    } else {
      this.favoritesSet.add(pokemonId);
      this.pokemonService.addFavoritePokemon(pokemonId).subscribe({
        next: () => console.log(`Pokemon ${pokemonId} added to favorites`),
        error: (err) => {
          console.error(`Error adding Pokémon ${pokemonId} to favorites:`, err);
          this.router.navigate(['/error'], { queryParams: { message: 'שגיאה בהוספת הפוקימון למועדפים.' } });
        }
      });
    }
  }

  toggleShowFavorites(): void {
    this.showOnlyFavorites = !this.showOnlyFavorites;
  }

  updatePokemonName(pokemonId: number, newName: string): void {
    const pokemon = this.pokemons.find(p => p.id === pokemonId);
    if (pokemon) {
      pokemon.name = newName;
    }
  }

  editPokemon(pokemonId: number, pokemonName: string): void {
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      width: '20vw',  
      height: '30vh', 
      data: { name: pokemonName }
    });
  
    dialogRef.afterClosed().subscribe(newName => {
      if (newName && newName.trim()) {
        this.updatePokemonName(pokemonId, newName);
      }
    });
  }

  viewPokemonDetails(pokemon: any ): void {
    this.dialog.open(PokemonDetailsDialogComponent, {
      data: pokemon,
      width: '60vw',  
      height: '85vh',
    });
  }

  // savePokemonName(pokemonId: number, newName: string): void {
  //   if (newName.trim()) {
  //     this.updatePokemonName(pokemonId, newName);
  //   }
  //   this.editingPokemonId = null;
  // }
}
