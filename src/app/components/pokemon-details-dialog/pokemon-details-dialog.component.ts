import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PokemonService } from '../../services/pokemon.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-pokemon-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatGridListModule,
  ],
  templateUrl: './pokemon-details-dialog.component.html',
  styleUrl: './pokemon-details-dialog.component.css'
})

export class PokemonDetailsDialogComponent implements OnInit{
  
  pokemonDetails: any;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PokemonDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.pokemonService.getPokemonDetails(this.data.id).subscribe(details => {
      this.pokemonDetails = details;
      this.isLoading = false;
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}