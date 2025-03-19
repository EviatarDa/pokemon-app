import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';

export const routes: Routes = [
    { path: '', component: PokemonListComponent },
    { path: 'error', component: ErrorPageComponent },
];
