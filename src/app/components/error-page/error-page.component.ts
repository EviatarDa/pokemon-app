import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-page.component.html', 
  styleUrls: ['./error-page.component.css'] 
})
export class ErrorPageComponent {
  errorMessage: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.errorMessage = this.route.snapshot.queryParams['message'] || 'אירעה תקלה בלתי צפויה.';
  }

  goBack(): void {
    this.router.navigate(['/']); 
  }
}
