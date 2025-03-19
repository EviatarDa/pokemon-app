import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-name-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './edit-name-dialog.component.html',
  styleUrl: './edit-name-dialog.component.css'
})
export class EditNameDialogComponent {
  pokemonName: string;

  constructor(
    public dialogRef: MatDialogRef<EditNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {
    this.pokemonName = data.name;
  }

  save(): void {
    this.dialogRef.close(this.pokemonName);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}