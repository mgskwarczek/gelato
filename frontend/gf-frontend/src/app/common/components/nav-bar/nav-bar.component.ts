import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  @Input() username: string = 'Name Surname';
  @Input() showLogoutButton: boolean = true;

  constructor(private router: Router) {}

  onLogout() {
    this.router.navigate(['/login']);
  }
}
